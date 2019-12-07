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

dbobj.updateUser = async (user, ip) => {
    try {
        db = Helper.getInstance();

        const dat = await db.collection("cesta").updateMany({ip: ip}, { $set: {user: user}});
        return dat;
    } catch (error) {
        console.log(error);
    }
}

dbobj.delete = async (user) => {
    try {
        db = Helper.getInstance();

        const dat = await db.collection("cesta").deleteMany({user: user});
        return dat;
    } catch (error) {
        console.log(error);
    }
}

dbobj.getAll = async (datos) => {
    try {
        db = Helper.getInstance();

        const dat = await db.collection("cesta").find(datos).toArray();
        return dat;
    } catch (error) {
        console.log(error);
    }
}

dbobj.remove = async (datos) => {
    try {
        db = Helper.getInstance();
        var query = {
            user: datos.user
        };

        const dat = await db.collection("cesta").deleteMany(query);
    } catch (error) {
        console.log(error);
    }
}

dbobj.update = async (datos) => {
    try {
        db = Helper.getInstance();
        let ret = await db.collection("cesta").replaceOne({ _id: Helper.getId(datos._id) }, datos);
        if (ret && ret.matchedCount > 0)
            return true;
        else
            return false;
    } catch (error) {
        console.log(error);
    }
}


module.exports = dbobj