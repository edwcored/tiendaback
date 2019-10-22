//app.use('/api/', requestChangePassword);
var express = require('express');
var router = express.Router();
var personaModel = require('../models/persona.js');
var cryptoHelper = require('../utils/CryptoHelper');
const RESULTS = require('../utils/Constantes')
const vt = require('./tokenUtils');

router.post('/login', async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        if (!req.body.nui || !req.body.pwd) {
            respuesta.resultCode = RESULTS.JSONINVALID;
            respuesta.result = false;
        } else {
            const persona = await personaModel.get(req.body.nui);
            if (persona && persona != null) {
                if (persona.pwd) {
                    const hash = cryptoHelper.md5(req.body.pwd);
                    if (hash === persona.pwd) {
                        persona.pwd = undefined;
                        respuesta.data = persona;
                    } else {
                        respuesta.resultCode = RESULTS.PASSWORDINVALID;
                    }
                } else {
                    respuesta.resultCode = RESULTS.CHANGEPASSWORD;
                }
            } else {
                respuesta.resultCode = RESULTS.USERINVALID;
            }
        }
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

router.post('/getToken', async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        if (!req.body.nui || !req.body.pwd) {
            respuesta.resultCode = RESULTS.JSONINVALID;
            respuesta.result = false;
        } else {
            const persona = await personaModel.get(req.body.nui);
            if (persona && persona != null) {
                if (persona.pwd) {
                    const hash = cryptoHelper.md5(req.body.pwd);
                    if (hash === persona.pwd) {
                        var currentIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                        respuesta.data = {};
                        respuesta.data.token = await vt.createToken(req.body.nui, currentIp, req.body.nuiemp, req.body.rol, false);
                        respuesta.data.menudef = [];// await RolModel.getPermisions(req.body.nuiemp, req.body.rol);
                    } else {
                        respuesta.resultCode = RESULTS.PASSWORDINVALID;
                    }
                } else {
                    respuesta.resultCode = RESULTS.PASSWORDINVALID;
                }
            } else {
                respuesta.resultCode = RESULTS.USERINVALID;
            }
        }
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

router.post('/changePassword', async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }
        let cambiar = false;
        const persona = await personaModel.get(req.body.nui);
        if (persona && persona != null) {
            if (persona.pwd) {
                if (req.body.pwd) {
                    const hash = cryptoHelper.md5(req.body.pwd);
                    if (hash === persona.pwd) {
                        cambiar = true;
                    } else {
                        respuesta.resultCode = RESULTS.PASSWORDINVALID;
                    }
                } else {
                    respuesta.result = false;
                    respuesta.resultCode = RESULTS.ERROR;
                    respuesta.message = 'Se debe proveer la clave anterior';
                }
            } else {
                cambiar = true;
            }
        } else {
            respuesta.resultCode = RESULTS.USERINVALID;
        }

        if (cambiar === true) {
            const hash = cryptoHelper.md5(req.body.newPwd);
            cambiores = await personaModel.changePassword(req.body.nui, hash);
            if (cambiores > 0) {
                respuesta.resultCode = RESULTS.OK;
            } else {
                respuesta.resultCode = RESULTS.NOAFECTED;
            }
        }

        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

router.post('/requestChangePassword', async (req, res) => {
    try {
        let respuesta = {
            result: true
        }
        let result = await personaModel.get(req.body.nui);

        if (result && result !== null) {
            respuesta.resultCode = RESULTS.OK;
            let codigo = cryptoHelper.generarCodigo();
            let scodigo = codigo.substring(0, 5);
            if (result.email) {
                await personapModel.setClave(req.body.nui, scodigo);
                emailHelper.sendEmail(result.email, 'SOLICITUD DE CAMBIO DE CLAVE', 'EL CODIGO PARA LA SOLICITUD DE CAMBIO DE CLAVE ES: ' + scodigo);
            } else {
                respuesta.resultCode = RESULTS.NOEMAIL;
            }
        } else {
            respuesta.resultCode = RESULTS.USERINVALID;
        }
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

router.post('/getcliente', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        };

        respuesta.data = await personaModel.getcliente(req.nui);

        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})


router.post('/persona5', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        };

        respuesta.data = await personaModel.get5(req.body);

        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

router.post('/get', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        if (!req.body.nui) {
            respuesta.resultCode = RESULTS.JSONINVALID;
            respuesta.result = false;
        } else {
            const ret = await personaModel.getEmp(req.body.nui);
            if (ret !== undefined && ret !== null)
            {
                ret.pwd = undefined;
                ret.emps = ret.emps.find((x) => x.nui == req.session.nuiemp);    
            }
            respuesta.data = ret;
        }
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

router.post('/merge', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }
        const insertando = req.body._id === undefined;

        let ret = await personaModel.merge(req.body);
        if (ret === -3) {
            respuesta.RESULTS.USERINVALID;
        } else {
            if (insertando === false) {
                respuesta.data = ret.matchedCount;
            } else {
                respuesta.data = ret.insertedId.toString();;
            }
        }
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})
module.exports = router;
