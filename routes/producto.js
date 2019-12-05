var express = require('express');
var router = express.Router();
var productoModel = require('../models/producto.js');
const RESULTS = require('../utils/Constantes')
const vt = require('./tokenUtils');

router.post('/create', async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        var lista = req.body.miga.toUpperCase().split("/");
        for (var i = 0; i < lista.length; i++) {
            req.body["miga" + i] = lista[i];
        }

        respuesta.data = await productoModel.create(req.body);
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})


router.post('/getn', async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }


        respuesta.data = await productoModel.getn(req.body);
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

router.post('/get', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        };

        respuesta.data = await productoModel.get(req.body.id);

        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})


module.exports = router;
