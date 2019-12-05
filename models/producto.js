var Helper = require("./helperMongo");
const RESULTS = require('../utils/Constantes')

const faker = require('faker');

var dbobj = {};

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


dbobj.getn = async function (parametros) {
    try {
        db = Helper.getInstance();
        let filtro = {};
        if (parametros.nombre) {
            filtro.nombre = parametros.nombre;
        }
        if (parametros.clasificacion) {
            filtro.clasificacion = parametros.clasificacion
        }

        let resumen = { nombre: 1, precio: 1, clasificacion: 1, descripcion: 1 }

        const res = await db.collection("productos").find(filtro, resumen)
            .skip((parametros.index * parametros.tamano))
            .limit(parametros.tamano).toArray();

        return res;
    } catch (error) {
        console.log(error);
    }
}

dbobj.generar100 = async () => {
    db = Helper.getInstance();

    faker.locale("es");
    for (let i = 0; i < 100; i++) {
        const productoNuevo = {
            clasificacion: faker.commerce.department({ max: 5 }),
            nombre: faker.commerce.productName(),
            precio: faker.commerce.price(),
            imagen: faker.image.image(),
            descripcion: "esta es la descripcion del producto",
            detalle: "slkdlksdljf lksdjf lskdjf lskdjf lskjldkj flksjd lfkdhjflkg dkfhgkdjf giushrouh; sfah ;odfugh difuhg dkfjhksjsdh ifuhsf kdjf hgkdjfh kdur hdkufghd"
        }

        await db.collection("productos").insertOne(productoNuevo);
    }

    const clasificaciones = await db.collection("productos").distinct('clasificacion');
    if (clasificaciones && clasificaciones.length > 0) {
        for (let j = 0; j < clasificaciones.length; j++) {
            await db.collection("dominiovalor").insertOne({dom: "clasificacion", cod: j, nom: clasificaciones[j]})
        }
    }
}

module.exports = dbobj