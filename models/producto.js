var Helper = require("./helperMongo");
const RESULTS = require('../utils/Constantes')

var dbobj = {};
const resumen = { nom: 1, pres: { sku: 1, defimg: 1 } };

dbobj.get = async (lid) => {
    try {
        db = Helper.getInstance();
        var query = {
            _id: Helper.getId(lid)
        };

        let ret = await db.collection("productos").find(query).toArray();
        if (ret && ret.length > 0)
            return ret[0];
        else
            return null;
    } catch (error) {
        console.log(error);
    }
}


dbobj.getn = async function (parametros) {
    try {
        db = Helper.getInstance();

        let filtro = { pres: { sku: parametros.sku, activo: true } };
        let resumen = { nombre: 1, precio: 1, clasificacion: 1 }
        
        return await db.collection("productos").find(filtro, resumen).toArray();
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbobj