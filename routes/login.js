var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var UserModel = require('../models/user');

app.post('/', (req, res, next) => {

    var body = req.body;

    UserModel.findOne({ email: body.email }, (err, userDB) => {
        console.log('error: ', err);
        console.log('user: ', userDB);

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                error: err
            });
        }

        if (!userDB || !body.password) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - email',
                error: { message: 'No existe el usuario' }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas - password',
                error: { message: 'No existe el usuario' }
            });
        }

        // create token!!
        userDB.password = ':)';
        var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id
        });
    });
});



module.exports = app;