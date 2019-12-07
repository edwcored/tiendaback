var Helper = require("./helperMongo");

var dbobj = {};

dbobj.insert = async (datos) => {
    try {
        db = Helper.getInstance();
        let ret = await db.collection("cesta").insertOne(datos);
        if (ret && ret.insertedCount > 0)
            return true;
        else
            return false;
    } catch (error) {
        console.log(error);
    }
}

dbobj.getProd = async (datos) => {
    try {
        db = Helper.getInstance();
        var query = {
            ip: datos.ip,
            idProd: Helper.getId(datos.idProd)
        };

        if (datos.user) {
            query.user = datos.user;
        }

        const dat = await db.collection("cesta").find(query).toArray();
        if (dat && dat.length > 0) {
            return dat[0];
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
    }
}

dbobj.insert = async (datos) => {
    try {
        db = Helper.getInstance();
        datos.idProd = Helper.getId(datos.idProd);
        let ret = await db.collection("cesta").insertOne(datos);
        if (ret && ret.insertedCount > 0)
            return true;
        else
            return false;
    } catch (error) {
        console.log(error);
    }
}

dbobj.update = async (datos) => {
    try {
        db = Helper.getInstance();
        let ret = await db.collection("cesta").replaceOne({_id: Helper.getId(datos._id)}, datos);
        if (ret && ret.matchedCount > 0)
            return true;
        else
            return false;
    } catch (error) {
        console.log(error);
    }
}


module.exports = dbobj