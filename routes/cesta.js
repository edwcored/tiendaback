var express = require('express');
var router = express.Router();
const RESULTS = require('../utils/Constantes')
const vt = require('./tokenUtils');
var comprasModel = require('../models/compras');
const cestaModel = require('../models/cesta');
const productoModel = require('../models/producto');
var sesion = require('../models/sesion');

router.post('/add', async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        let prod = { idProd: req.body._id };
        // si ya inicio sesion
        if (req.headers.token) {
            const payload = await vt.getPayload(req.headers.token);
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
            } else {
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

router.post('/get', async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        let prod = {};
        // si ya inicio sesion
        if (req.headers.token) {
            const payload = await vt.getPayload(req.headers.token);
            prod.user = payload.user
        } else {
            prod.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        }

        // se consulta si ya esta agregado este producto para este cliente
        respuesta.data = await cestaModel.getAll(prod);

        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

router.post('/finish', async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        let prod = {};
        let payload = {};
        // si ya inicio sesion
        if (req.headers.token) {
            payload = await sesion.get(req.headers.token)
            prod.ip = payload.ip;
            prod.user = payload.u
        } else {
            res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: 'No se ha iniciado sesion' });
        }


        await cestaModel.updateUser(prod.user, req.headers['x-forwarded-for'] || req.connection.remoteAddress)
        const pr = await cestaModel.getAll(prod);
        if (pr && pr.length) {
            let dataCompra = {
                user: payload.user,
                fecha: new Date(),
                subtotal: 0,
                iva: 0,
                total: 0,
                productos: pr
            };

            dataCompra.productos.forEach(element => {
                element.subtotal = element.cant * element.precio;
                element.vrIva = Math.round(element.subtotal * element.iva / 100);
                element.total = element.subtotal + element.vrIva;
                dataCompra.subtotal += element.subtotal;
                dataCompra.vrIva += element.vrIva;
                dataCompra.total += element.total;
            });

            const res = await comprasModel.insert(dataCompra);
            await cestaModel.delete(prod.user);
            
            if (!res) {
                respuesta.resultCode = RESULTS.NOAFECTED;
            }
        } else {
            res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: 'No hay productos en la cesta' });
        }

        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})




module.exports = router;