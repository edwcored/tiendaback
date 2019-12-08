var express = require('express');
var router = express.Router();
const RESULTS = require('../utils/Constantes')
const comprasModel = require('../models/compras')

router.post('/get', async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        respuesta.data = await comprasModel.getAll(req.headers.token);
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

module.exports = router;