var Helper = require("./helperMongo");

var dbobj = {};

dbobj.get = async (id) => {
    try {
        db = Helper.getInstance();
        let ret = await db.collection("sessions").find({ _id: Helper.getId(id) }).toArray();
        if (ret && ret.length > 0)
            return ret[0];
        else
            return null;
    } catch (error) {
        console.log(error);
    }
}

dbobj.getByNui = async (pnui) => {
    try {
        db = Helper.getInstance();
        let ret = await db.collection("sessions").find({ n: pnui }).toArray();
        if (ret && ret.length > 0)
            return ret[0];
        else
            return null;
    } catch (error) {
        console.log(error);
    }
}

dbobj.saveHitory = async function (ses) {
    try {
        db = Helper.getInstance();
        return await db.collection("sessionHistory").insertOne(ses);
    } catch (error) {
        console.log(error);
    }
}

dbobj.delete = async (pnui) => {
    try {
        db = Helper.getInstance();
        await db.collection("sessions").deleteMany({ n: pnui });
    } catch (error) {
        console.log(error);
    }
}

dbobj.insert = async (data) => {
    try {
        db = Helper.getInstance();
        return await db.collection("sessions").insertOne(data);
    } catch (error) {
        console.log(error);
    }
}

dbobj.update = async (pnui, pexp) => {
    try {
        db = Helper.getInstance();
        await db.collection("sessions").updateOne({ n: pnui }, { $set: { exp: pexp } });
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbobj