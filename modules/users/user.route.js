const express = require('express');
const bcrypt = require('bcryptjs');
const RESPONSE = require('../../common/response');
const userModel = require('./user.model');
const modelManager = require('../factory_producer').getDBFactory('mongodb', userModel);

var app = express();

app.get('/', (req, res) => {
    modelManager.find({}, {
        fields: [
            'name',
            'email',
            'img'
        ]
    }, 0).then(data => {
        modelManager.modelCount().then(total => {
            RESPONSE.response('usuarios', data, 200, 'exito', res, total);
        });
    }).catch(err => {
        RESPONSE.response('usuarios', err, 500, 'Error al buscar usuarios', res);
    });
});

app.post('/', (req, res) => {
    let body = req.body;
    console.log(body);
    body.password = bcrypt.hashSync(body.password, 10);
    modelManager.create(body).then(user => {
        RESPONSE.response('usuario', user, 200, 'El usuario se creo correctamente', res);
    }).catch(err => RESPONSE.response('usuario', err, 400, 'Error al crear usuario', res));
});

app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    modelManager.update(id, body)
        .then(user => {
            user.password = '(:';
            RESPONSE.response('usuario', user, 200, 'Usuario actualizado correctamente', res);
        })
        .catch(err => {
            RESPONSE.response('usuario', err, 400, 'Error al Actualizar usuario', res);
        });
});

app.delete('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    modelManager.remove(id)
        .then(data => {
            RESPONSE.response('usuario', data, 200, 'Usuario eliminado correctamente', res);
        })
        .catch(err => {
            RESPONSE.response('usuario', err, 400, 'Error al eliminar usuario', res);
        });
});


module.exports = app;