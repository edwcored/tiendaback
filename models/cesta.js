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

dbobj.getCupon = async (cupon) => {
    try {
        db = Helper.getInstance();

        const dat = await db.collection("cupones").find({cupon: cupon}).toArray();
        if(dat && dat.length > 0){
            return dat[0];
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
    }
}

dbobj.setCupon = async (cupon) => {
    try {
        db = Helper.getInstance();

        await db.collection("cuponesPendientes").insertOne(cupon);
    } catch (error) {
        console.log(error);
    }
}

dbobj.updateUserCupon = async (user, ip) => {
    try {
        db = Helper.getInstance();
        await db.collection("cuponesPendientes").updateMany({ip: ip}, { $set: {user: user}});
    } catch (error) {
        console.log(error);
    }
}

dbobj.limpiarCupon = async (datos) => {
    try {
        db = Helper.getInstance();

        // se obtiene el cupon para eliminarlos, dado que son cupones de un solo uso
        const cupon = await db.collection("cuponesPendientes").find({user: datos}).toArray();
        for (let i = 0; i < cupon.length; i++) {
            await db.collection("cupones").deleteMany({cupon: element.cupon});
        }

        await db.collection("cuponesPendientes").deleteMany({user: datos});
    } catch (error) {
        console.log(error);
    }
}

dbobj.getPendingCupon = async (user) => {
    try {
        db = Helper.getInstance();

        // se obtiene el cupon para eliminarlos, dado que son cupones de un solo uso
        const cupon = await db.collection("cuponesPendientes").find({user: user}).toArray();
        if (cupon && cupon.length > 0) {
            return cupon[0];
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
    }
}



module.exports = dbobj