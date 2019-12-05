var Helper = require("./helperMongo");

var dbobj = {};

dbobj.get = async (user) => {
    try {
        db = Helper.getInstance();

        let ret = await db.collection("personas").find({ user: user }).toArray();
        if (ret && ret.length > 0)
            return ret[0];
        else
            return null;
    } catch (error) {
        console.log(error);
    }
}

dbobj.create = async (datos) => {
    try {
        db = Helper.getInstance();
        let ret = await db.collection("personas").insertOne(datos);
        if (ret && ret.insertedCount > 0) {
            return true;
        } else {
            return false
        };
    } catch (error) {
        console.log(error);
    }
}

dbobj.changePassword = async (pnui, ppwd) => {
    try {
        db = Helper.getInstance();
        let ret = await db.collection("personas").updateOne({ nui: pnui }, { $set: { pwd: ppwd } });
        return ret.modifiedCount;
    } catch (error) {
        console.log(error);
    }
}


dbobj.merge = async (datos) => {
    try {
        db = Helper.getInstance();

        if (datos._id && datos._id !== null) {
            let personav = await db.collection("personas").find({ _id: Helper.getId(datos._id) }).toArray();

            if (personav != null && personav.length > 0) {
                let persona = personav[0];

                persona.pnom = datos.pnom;
                persona.snom = datos.snom;
                persona.papll = datos.papll;
                persona.sapll = datos.sapll;
                persona.dir = datos.dir;
                persona.tel = datos.tel;
                persona.cel = datos.cel;
                persona.email = datos.email;
                persona.activo = datos.activo;
                persona.geografia = datos.geografia;
                
                return await db.collection("personas").replaceOne({ _id: Helper.getId(persona._id) }, persona);
            } else {
                return -3;
            }
        } else {
            return await db.collection("personas").insertOne(datos);
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = dbobj