// Requires
/*var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var URL_API = require('./config/config').URL_API;

// Import routes 
var appRoutes = require('./modules/index');
var usuarioRoutes = require('./routes/usuario');
// var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagesRoutes = require('./routes/images');

// Init variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// db connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Data base: \x1b[32m%s\x1b[0m', 'online');
});

// Server index config
//var serveIndex = require('serve-index');
//app.use(express.static(__dirname + '/'))
//app.use('/uploads', serveIndex(__dirname + '/uploads'));


// Rutas
// app.use('/login', loginRoutes);
// app.use('/user', usuarioRoutes);
//app.use('/hospital', hospitalRoutes);
// app.use('/medico', medicoRoutes);
// app.use('/search', busquedaRoutes);
// app.use('/upload', uploadRoutes);
// app.use('/img', imagesRoutes);
app.use(URL_API, appRoutes);


// listen request
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', 'online');
});
*/

/* eslint linebreak-style: ["error", "windows"]*/
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config');
const http = require('http');
const mongoose = require('mongoose');
const moduleLog = require('./common/log');
const Log = new moduleLog();

/**
 * Start with server
 */
class App {

    /**
     * constructor
     */
    constructor() {
        this.app = express();
        mongoose.connect('mongodb://' + config.database.host + ':' + config.database.port + '/' + config.database.name, this.responseDB);
        this.configure();
        this.server = http.createServer(this.app);
        this.server.listen(config.server.port, () => {
            let host = this.server.address().address;
            let port = this.server.address().port;
            console.info('Example app listening at http://%s:%s \x1b[32m%s\x1b[0m', host, port, 'online');
        });

    }

    /**
     * configure -Configure the server.
     */
    configure() {

        // CORS
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
            next();
        });

        this.app.use(express.Router()); // eslint-disable-line
        this.app.use(bodyParser.json({
            limit: '50mb'
        }));
        this.app.use(bodyParser.urlencoded({
            limit: '50mb',
            extended: true
        }));
        this.app.use(logger('dev'));
        this.app.use(this.functionInterceptor);
    }

    /**
     * functionInterceptor - description
     *
     * @param  {object} req  description
     * @param  {object} res  description
     * @param  {callback} next description
     */
    functionInterceptor(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods',
            'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers',
            'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        Log.saveResponse(res);
        next();
    }

    /**
     * addModule - description
     *
     * @param  {object} Module  description
     */
    addModule(Module) {
        new Module(this.app);
    }

    /**
     * @param  {} error     description
     */
    responseDB(error) {
        if (error) {
            console.warn('ERROR: connecting to DataBase, ' + error);
        } else {
            console.info('Data base: \x1b[32m%s\x1b[0m', 'online');
        }
    }
}

let app = new App();
module.exports = app;
//app.addModule(bpm);
//app.addModule(passeAzulV2);
//app.addModule(pdfGenerator);
//app.addModule(erpv9);