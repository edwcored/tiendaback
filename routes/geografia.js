var express = require('express');
var router = express.Router();
var geografiaModel = require('../models/geografia');
const RESULTS = require('../utils/Constantes')
const vt = require('./tokenUtils');

router.get('/listdepartamentos', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        respuesta.data = await geografiaModel.ListDepartamentos();
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})


router.post('/listciudades', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        respuesta.data = await geografiaModel.ListCiudades(req.body.cdpto);
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

module.exports = router;
