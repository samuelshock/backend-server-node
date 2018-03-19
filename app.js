// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const config = require('./config');
const http = require('http');
const moduleLog = require('./common/log');
const Log = new moduleLog();

const URL_API = require('./config/config').URL_API;

// Import routes 
var appRoutes = require('./modules/index');
var usuarioRoutes = require('./routes/usuario');
// var hospitalRoutes = require('./routes/hospital');
// var medicoRoutes = require('./routes/medico');
var loginRoutes = require('./routes/login');
// var busquedaRoutes = require('./routes/busqueda');
// var uploadRoutes = require('./routes/upload');
// var imagesRoutes = require('./routes/images');

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
//var serveIndex = require('serve-index');
//app.use(express.static(__dirname + '/'))
//app.use('/uploads', serveIndex(__dirname + '/uploads'));


// Rutas
app.use('/login', loginRoutes);
app.use('/user', usuarioRoutes);
//app.use('/hospital', hospitalRoutes);
// app.use('/medico', medicoRoutes);
// app.use('/search', busquedaRoutes);
// app.use('/upload', uploadRoutes);
// app.use('/img', imagesRoutes);
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