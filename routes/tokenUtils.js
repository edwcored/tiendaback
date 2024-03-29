var sesion = require('../models/sesion');
const RESULTS = require('../utils/Constantes')
//const jwt = require('jsonwebtoken');
const config = require('../utils/Config');

const MinutosSession = 1440;

var TokenUtils = {};

TokenUtils.createToken = async function (req, user, force) {
    let rol = "";
    // solo se manejaran dos roles, user y admin y solo un usuario puede ser admin
    if (user === "admin@admin") {
        rol = "admin"
    } else {
        rol = "user";
    }
    var currentIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
    var payload = {
        u: user,
        r: rol,
        ip: currentIp,
        cd: new Date(),
        exp: new Date(new Date().getTime() + (MinutosSession * 60 * 1000))
    };
    var inserted;

    //var strtoken = jwt.sign(payload, config.TOKEN_SECRET);
    //payload.token = strtoken;
    try {
        //validate that a session it's not created before
        const sessionInBd = await sesion.getByNui(user);
        if (sessionInBd && sessionInBd != null) {
            var minutesToNow = (new Date().getTime() - sessionInBd.exp.getTime()) / (60 * 1000);
            if (minutesToNow > MinutosSession || force === true) {
                await sesion.saveHitory(payload);
                await sesion.delete(user);
                inserted = await sesion.insert(payload);
            } else {
                if (sessionInBd.ip !== ipAddres) {
                    return {
                        result: false,
                        resultCode: RESULTS.SESIONANOTHER
                    };
                } else {
                    await sesion.saveHitory(payload);
                    await sesion.delete(user);
                    inserted = await sesion.insert(payload);
                }
            }
        } else {
            await sesion.saveHitory(payload);
            inserted = await sesion.insert(payload);
        }
        return inserted.insertedId.toString();
    } catch (e) {
        return null;
    }
}

TokenUtils.getPayload = async function(req) {
    payload = await sesion.get(req)
}

TokenUtils.validateToken = async function (req, res, next) {
    if (!req.headers.token) {
        return res.status(200).json({ result: false, resultCode: RESULTS.TOKENINVALID });
    }

    var payload = {};
    try {
        payload = await sesion.get(req.headers['token'])
        //payload = jwt.verify(tokenEncoded, config.TOKEN_SECRET);
    }
    catch (error) {
        return res.status(200).json({ result: false, resultCode: RESULTS.TOKENINVALID });
    }

    if (payload && payload !== null) {
        //validate ip addres
        var currentIp = rq.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (payload.ip !== currentIp) {
            return res.status(200).send({ result: false, resultCode: RESULTS.INVALIDIP });
        }

        var milliseconds = (new Date().getTime()) - (new Date(payload.exp).getTime());
        var minutesToNow = milliseconds / (1000 * 60);

        if (minutesToNow > 1440) {
            //droop session
            sesion.delete(payload.u);
            return res.status(200).send({ result: false, resultCode: RESULTS.TOKENEXPIRED });
        }
        else {
            //renew the token
            req.session = {
                user: payload.u,
                rol: payload.r
            };
            await sesion.update(payload.u, new Date(new Date().getTime() + (MinutosSession * 60 * 1000)));
            next();
        }
    } else {
        return res.status(200).json({ result: false, resultCode: RESULTS.TOKENINVALID });
    }
}

module.exports = TokenUtils;