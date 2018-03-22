// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const config = require('./config');
const http = require('http');
const moduleLog = require('./common/log');
const Log = new moduleLog();


// config
const { URL_API } = require('./config/config');

// Import routes 
var appRoutes = require('./modules/index');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Init variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    Log.saveResponse(res);
    next();
});

// body Parser
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(express.Router()); // eslint-disable-line
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(logger('dev'));

// db connection
mongoose.connection.openUri('mongodb://' + config.database.host + ':' + config.database.port + '/' + config.database.name, (err, res) => {
    if (err) throw err;
    console.log('Data base: \x1b[32m%s\x1b[0m', 'online');
});

// Server index config
// Todo: remove dependencie in prod
//var serveIndex = require('serve-index');
//app.use(express.static(__dirname + '/'))
//app.use('/uploads', serveIndex(__dirname + '/uploads'));


// Rutas
app.use('/login', loginRoutes);
app.use('/user', usuarioRoutes);
app.use(URL_API, appRoutes);


// listen request
// app.listen(3000, () => {
//     console.log('Express server port 3000: \x1b[32m%s\x1b[0m', 'online');
// });
const server = http.createServer(app);
server.listen(config.server.port, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.info('Example app listening at http://%s:%s \x1b[32m%s\x1b[0m', host, port, 'online');
});