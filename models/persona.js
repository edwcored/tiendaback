var Helper = require("./helperMongo");

var dbobj = {};

dbobj.get = async (pnui) => {
    try {
        db = Helper.getInstance();

        const projection = {
            _id: 0,
            nui: 1,
            rs: 1,
            email: 1,
            pwd: 1,
            'emps.nui': 1,
            'emps.rs': 1,
            'emps.roles': 1
        };

        let ret = await db.collection("personas").find({ nui: pnui }).project(projection).toArray();
        if (ret && ret.length > 0)
            return ret[0];
        else
            return null;
    } catch (error) {
        console.log(error);
    }
}

dbobj.getEmp = async (pnui) => {
    try {
        db = Helper.getInstance();
        let ret = await db.collection("personas").find({ nui: pnui }).toArray();
        if (ret && ret.length > 0)
            return ret[0];
        else
            return null;
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

dbobj.getcliente = async (nui) => {
    try {
        db = Helper.getInstance();

        let filtro = { nui: nui };

        const resumen = {
            nui: 1, rs: 1, empresas
        };

        const res = await db.collection("personas").find(filtro, resumen).toArray();
        if (res.length > 0) {
            return res[0];
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
    }
}

dbobj.get5 = async (parametros) => {
    try {
        db = Helper.getInstance();

        let filtro;
        if (parametros.nui) {
            if (parametros.cliente) {
                filtro = { nui: parametros.nui, empresas: { nui: parametros.nuiempresa, cliente: true, activo: true } };
            } else {
                filtro = { nui: parametros.rs, empresas: { nui: parametros.nuiempresa, proveedor: true, activo: true } };
            }
        } else if (parametros.rs) {
            if (parametros.cliente) {
                filtro = { rs: parametros.nui, empresas: { nui: parametros.nuiempresa, cliente: true, activo: true } };
            } else {
                filtro = { rs: parametros.rs, empresas: { nui: parametros.nuiempresa, proveedor: true, activo: true } };
            }
        } else {
            filtro = { invalid: true }; // filtro invalido para q no retorne datos
        }

        const resumen = {
            nui: 1, rs: 1, _id: 0
        };

        return await db.collection("personas").find(filtro, resumen).toArray();
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

                persona.rs = datos.rs;
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
                if (datos.emps && datos.emps.length > 0) {
                    if (persona.emps !== undefined && persona.emps !== null) {
                        let emp = persona.emps.find((x) => x.nui == datos.emps[0].nui);
                        if (emp === null) {
                            persona.emps.push(datos.emps[0]);
                        } else {
                            emp.rtfte = datos.emps[0].rtfte;
                            emp.rtiva = datos.emps[0].rtiva;
                            emp.baseCero = datos.emps[0].baseCero;
                            emp.dcart = datos.emps[0].dcart;
                            emp.topv = datos.emps[0].topv;
                            emp.cupo = datos.emps[0].cupo;
                            emp.mayorista = datos.emps[0].mayorista;
                            emp.roles = datos.emps[0].roles;
                            emp.tipoPersona = datos[0].tipoPersona;
                            emp.regimen = datos[0].regimen; 
                        }
                    } else {
                        persona.emps = [];
                        persona.emps.push(datos.emps[0])
                    }
                }

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

dbobj.getVendedores = async (pempnui, pactivo) => {
    try {
        db = Helper.getInstance();
        const query = {
            "activo": pactivo,
            "emps.nui": pempnui,
            "emps.roles.cod": 3
        };

        const projection = {
            "nui": "$nui",
            "rs": "$rs",
            "_id": 0
        };

        let ret = await db.collection("personas").find(query).project(projection).toArray();
        return ret;
    } catch (error) {
        console.log(error);
    }
}


module.exports = dbobj