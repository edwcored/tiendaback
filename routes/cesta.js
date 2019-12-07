var express = require('express');
var router = express.Router();
const RESULTS = require('../utils/Constantes')
const vt = require('./tokenUtils');
var productoModel = require('../models/producto.js');
const cestaModel = require('../models/cesta')


router.post('/add', async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        let prod = { idProd: req.body._id };
        // si ya inicio sesion
        if (req.headers.token) {
            const payload = vt.getPayload(req);
            prod.ip = payload.ip;
            prod.user = payload.user
        } else {
            prod.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        }


        // se consulta si ya esta agregado este producto para este cliente
        const pr = await cestaModel.getProd(prod);
        if (pr) {
            pr.cant = req.body.cant;
            const res = await cestaModel.update(pr);
            if (!res) {
                respuesta.resultCode = RESULTS.NOAFECTED;
            }else{
                respuesta.resultCode = RESULTS.REPITED;
            }
        } else {
            // se consulta el producto para obtener datos financieros
            const producto = await productoModel.get(req.body._id);
            if (producto) {
                producto.cant = req.body.cant;
                producto.ip = prod.ip;
                if (prod.user) producto.user = prod.user;
                producto.idProd = prod.idProd;

                if (!await cestaModel.insert(producto)) {
                    respuesta.resultCode = RESULTS.NOAFECTED;
                }
            } else {
                res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: 'Producto no encontrado en el sistema' });
            }
        }

        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})


module.exports = router;