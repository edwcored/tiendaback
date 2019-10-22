//Initiallising node modules
var express = require("express");
var cors = require('cors')
var bodyParser = require("body-parser");
var app = express();
const path = require('path');
var compression = require('compression');
var helper = require("./models/helperMongo");

const CONFIG = require("./utils/Config");
// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(cors());
app.use(compression()); //Compress all routes

//connect to mongo
helper.initPool();

//OTERS Middleware
app.use(function (req, res, next) {
    res.header("Cache-Control", "no-cache");
    res.header("Cache-Control", "no-store");
    //TokenUtils.validateToken(req, res, next);
    next();
});


const persona = require('./routes/persona');
app.use('/api/persona', persona);

const producto = require('./routes/producto');
app.use('/api/productos', producto);

const dominiovalor = require('./routes/dominiovalor');
app.use('/api/dominiovalor', dominiovalor);

const geografia = require('./routes/geografia');
app.use('/api/geografia', geografia);

const utilidades = require('./routes/utilidades');
app.use('/api/utilidades', utilidades);


app.use('/images', express.static(CONFIG.RUTAIMG));

/*
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist/frontend')));
// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/frontend/index.html'));
});
*/
//Setting up server
var server = app.listen(300, function () {
    var port = server.address().port;
    console.log("REST funcionando el puerto: ", port);
});

