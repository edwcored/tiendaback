var Helper = require("./helperMongo");

var dbobj = {};

dbobj.list = async (pdom) => {
    try {
        let filtro;
        db = Helper.getInstance();
        // se busca si hay un filtro por defecto para estas
        filtro.dom = pdom;

        const projection = { cod: 1, nom: 1 };

        const orden = { cod: 1 };

        return await db.collection("dominiovalor")
            .find(filtro)
            .sort(orden)
            .project(projection)
            .toArray();

    } catch (error) {
        console.log(error);
    }
}

module.exports = dbobj