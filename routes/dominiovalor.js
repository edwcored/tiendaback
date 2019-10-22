var express = require('express');
var router = express.Router();
var dominiovalorModel = require('../models/dominiovalor.js');
const RESULTS = require('../utils/Constantes')
const vt = require('./tokenUtils');

router.post('/list', vt.validateToken, async (req, res) => {
    try {
        let respuesta = {
            result: true,
            resultCode: RESULTS.OK
        }

        respuesta.data = await dominiovalorModel.list(req.session.nuiemp, req.body.dom);
        res.status(200).json(respuesta);
    } catch (e) {
        res.status(200).json({ result: false, resultCode: RESULTS.ERROR, message: e.message });
    }
})

module.exports = router;
