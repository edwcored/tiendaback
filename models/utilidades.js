const { poolPromise } = require('./helper')
const path = require('path');
const CONFIG = require("../utils/Config");

var dbobj = {};

dbobj.GetNumConsPref = async function (parametros) {
    try {
        db = Helper.getInstance();
        const filtro = {
            nui: parametros.nuiemp,
            prefijos: {
                org: parametros.org,
                pref: parametros.pref
            }
        };
        let ret = await db.collection("empresa").find(filtro, { prefijos: { cons: 1 } }).toArray();
        if (ret && ret.length > 0)
            return ret[0];
        else
            return null;
    } catch (error) {
        console.log(error);
    }
}

dbobj.SetNumConsPref = async function (parametros) {
    try {
        db = Helper.getInstance();
        const filtro = {
            nui: parametros.nuiemp,
            prefijos: {
                org: parametros.org,
                pref: parametros.pref
            }
        };
        let ret = await db.collection("empresa").updateOne(filtro, { $set: { prefijos: { cons: parametros.cons + 1 } } }).toArray();
        return ret.modifiedCount;
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbobj
