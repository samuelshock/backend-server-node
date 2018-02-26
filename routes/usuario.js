var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdaAthentication = require('../middlewares/authentication');

// var SEED = require('../config/config').SEED;

var app = express();

var UserModel = require('../models/user');

// ======================================
// Obtener Todos los Usuarios
// ======================================
app.get('/', (req, res, next) => {
    UserModel.find({}, 'name email img role')
        .exec(
            (err, users) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error cargando usuarios',
                        error: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    users: users
                });

            });
});


// ======================================
// Crear un Usuario
// ======================================
app.post('/', mdaAthentication.verifyToken, (req, res) => {

    var body = req.body;

    var user = new UserModel({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });


    user.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear usuario',
                error: err
            });
        }

        res.status(201).json({
            ok: true,
            user: userSaved
        });
    });

});

// ======================================
// Actualizar usuario
// ======================================
app.put('/:id', mdaAthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    UserModel.findById(id).exec((err, userValid) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                error: err
            });
        }

        if (!userValid) {
            return res.status(404).json({
                ok: false,
                message: 'Error al buscar usuario ' + id,
                error: { message: 'No existe el usuario' }
            });
        }

        userValid.name = body.name;
        userValid.email = body.email;
        userValid.role = body.role;
        userValid.password = ':)';

        userValid.save((err, userSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    error: err
                });
            }
            res.status(200).json({
                ok: true,
                user: userSaved
            });
        });

    });
});

// ======================================
// Eliminar usuario
// ======================================
app.delete('/:id', mdaAthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    UserModel.findByIdAndRemove(id).exec((err, userDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar usuario',
                error: err
            });
        }
        if (!userDeleted) {
            return res.status(404).json({
                ok: false,
                message: 'Error al buscar usuario ' + id,
                error: { message: 'No existe el usuario' }
            });
        }

        res.status(200).json({
            ok: true,
            user: userDeleted
        });

    });
});

module.exports = app;