var express = require('express');
var router = express.Router();
var productoModel = require('../models/producto.js');
const RESULTS = require('../utils/Constantes')
const vt = require('./tokenUtils');

router.post('/list', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        if (req.body.find) {
            // req.body.find.nui = req.session.nuiemp;
            req.body.find.$or = [
                {
                    "nui": null
                },
                {
                    "nui": req.session.nuiemp
                }
            ];
        } else {
            req.body.find = {
                "$or": [
                    {
                        "nui": null
                    },
                    {
                        "nui": req.session.nuiemp
                    }
                ]
            }
        }

        respuesta.data = await productoModel.list(req.body);
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

router.post('/validarNom', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        const ret = await productoModel.validarNom(req.session.nuiemp, req.body.nom, req.body.id);
        if (ret === false) {
            respuesta.resultCode = RESULTS.REPITED;
        }
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

router.post('/validarSKU', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        let ret = await productoModel.validarSKU(req.session.nuiemp, req.body.sku);
        if(ret === true) {
            respuesta.resultCode = RESULTS.REPITED;
        }
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


router.post('/productosku', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        respuesta.data = productoModel.get(req.body.codigo);

        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

router.post('/productonom', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        respuesta.data = productoModel.getNom(req.body.codigo);

        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

router.post('/insertPresentacion', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        respuesta.resultCode = productoModel.insertPresentacion(req.body);

        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})


module.exports = router;
