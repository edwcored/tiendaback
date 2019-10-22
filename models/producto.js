var Helper = require("./helperMongo");
const RESULTS = require('../utils/Constantes')

var dbobj = {};
const resumen = { nom: 1, pres: { sku: 1, defimg: 1 } };

dbobj.list = async (filters) => {
    try {
        db = Helper.getInstance();

        const projection = {
            nom: 1,
            inv: 1,
            excento: 1,
            iva: 1,
            act: 1,
            'clasifi.nom': 1,
            miga: 1
        };

        if (filters.find.nom) {
            filters.find.nom = Helper.BsonRegExp(filters.find.nom);
        }
        if (filters.find.miga) {
            filters.find.miga = Helper.BsonRegExp(filters.find.miga);
        }

        let orden = {};
        if (filters.orden) {
            orden = filters.orden;
        } else {
            orden = { nom: 1 };
        }

        let ret = await db.collection("productos")
            .find(filters.find)
            .sort(orden)
            .project(projection)
            .skip(filters.offset)
            .limit(filters.records).toArray();

        if (ret && ret.length > 0) {
            ret.forEach(element => {
                element.clasifi = element.clasifi.nom
            });
        }

        let temp = await db.collection("productos").find(filters.find).count();

        let respuesta = {
            items: ret,
            total: temp
        }

        return respuesta;
    } catch (error) {
        console.log(error);
    }
}

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

dbobj.insertPresentacion = async (datos) => {
    try {
        db = Helper.getInstance();
        var query = {
            _id: Helper.getId(datos.id)
        };

        let ret = await db.collection("productos").find(query).toArray();
        if (ret && ret.length > 0) {
            // se valida si ya existe la presentacion
            let existe = false;
            ret[0].presentaciones.forEach(element => {
                if (element.sku === datos.sku && element.unidad.cod === datos.unida.cod) {
                    existe = true
                }
            });

            if (existe === true) {
                return RESULTS.REPITED;
            } else {
                ret[0].presentaciones.push(data);
                ret = await db.collection("productos").replaceOne({ _id: Helper.getId(datos.id) }, ret[0]);
                if (ret.updatecount === 1)
                    return RESULTS.OK;
                else
                    return RESULTS.NOAFECTED;
            }
        } else {
            return RESULTS.INVALIDCODE;
        }
    } catch (error) {
        console.log(error);
    }
}


dbobj.get20 = async function (parametros) {
    try {
        db = Helper.getInstance();

        let filtro;
        if (parametros.sku) {
            filtro = { pres: { sku: parametros.sku, activo: true } };
        } else if (parametros.rs) {
            filtro = { rs: parametros.rs, empresas: { nom: parametros.nuiemp, proveedor: true } };
        } else {
            filtro = { invalid: true }; // filtro invalido para q no retorne datos
        }

        return await db.collection("personas").find(filtro, resumen).toArray();
    } catch (error) {
        console.log(error);
    }
}

dbobj.validarNom = async function (pnui, pnom, pid) {
    try {
        db = Helper.getInstance();

        let filtro = {
            $or: [{ nui: null }, { nui: pnui }],
            nom: pnom,
            _id: { $ne: Helper.getId(pid) }
        };

        let ret = await db.collection("productos").find(filtro, resumen).toArray();
        if (ret && ret.length > 0){
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

dbobj.validarSKU = async function (pnui, psku) {
    try {
        db = Helper.getInstance();

        let filtro = {
            $or: [{ nui: null }, { nui: pnui }],
            'presentaciones.sku': psku 
        };

        const ret = await db.collection("productos").find(filtro, { nom: 1 }).toArray();
        if (ret && ret.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbobj