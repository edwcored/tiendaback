var Helper = require("./helperMongo");
var sesion = require('../models/sesion');

var dbobj = {};

dbobj.insert = async (datos) => {
    try {
        db = Helper.getInstance();
        let ret = await db.collection("compras").insertOne(datos);
        if (ret && ret.insertedCount > 0)
            return true;
        else
            return false;
    } catch (error) {
        console.log(error);
    }
}

dbobj.getAll = async (token) => {
    try {
        db = Helper.getInstance();

        if (token) {
            let payload = await sesion.get(token);
            var query = {
                user: payload.u
            };
            return await db.collection("compras").find(query).toArray();
        } else {
            res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: 'No se ha iniciado sesion' });
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = dbobj