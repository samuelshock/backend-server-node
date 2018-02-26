// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Import routes 
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Init variables
var app = express();

// body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// db connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Data base: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/login', loginRoutes);
app.use('/user', usuarioRoutes);
app.use('/', appRoutes);


// listen request
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', 'online');
});