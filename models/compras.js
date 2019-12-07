var Helper = require("./helperMongo");

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

dbobj.getAll = async () => {
    try {
        db = Helper.getInstance();
        var query = {
            ip: datos.ip,
            idProd: Helper.getId(datos.idProd)
        };

        if (datos.user) {
            query.user = datos.user;
        }

        const dat = await db.collection("compras").find(query).toArray();
        if (dat && dat.length > 0) {
            return dat[0];
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = dbobj