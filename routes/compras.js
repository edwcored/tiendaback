var express = require('express');
var router = express.Router();
const RESULTS = require('../utils/Constantes')
const vt = require('./tokenUtils');
const comprasModel = require('../models/compras')


router.post('/get', async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        const payload = vt.getPayload(req);
        let prod = { user: payload.user };

        respuesta.data = await cestaModel.getProd(prod);
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

module.exports = router;