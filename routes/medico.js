var express = require('express');

var mdaAthentication = require('../middlewares/authentication');


var app = express();

var MedicoModel = require('../models/medico');

// ======================================
// Obtener Todos los Medicos
// ======================================
app.get('/', (req, res, next) => {

    var since = req.query.since || 0;
    since = Number(since);

    MedicoModel.find({})
        .skip(since)
        .limit(5)
        .populate("user", "name email")
        .populate("hospital")
        .exec(
            (err, items) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error cargando Medicos',
                        error: err
                    });
                }
                MedicoModel.count({}, (err, counter) => {
                    res.status(200).json({
                        ok: true,
                        medicos: items,
                        total: counter
                    });
                });

            });
});


// ======================================
// Crear un Medico
// ======================================
app.post('/', mdaAthentication.verifyToken, (req, res) => {

    var body = req.body;

    var newItem = new MedicoModel({
        nombre: body.name,
        img: body.email,
        user: req.user._id,
        hospital: body.hospital_id
    });


    newItem.save((err, itemSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear Medico',
                error: err
            });
        }

        res.status(201).json({
            ok: true,
            user: itemSaved
        });
    });

});

// ======================================
// Actualizar Medico
// ======================================
app.put('/:id', mdaAthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    MedicoModel.findById(id).exec((err, itemValid) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar Medico',
                error: err
            });
        }

        if (!itemValid) {
            return res.status(404).json({
                ok: false,
                message: 'Error al buscar Medico ' + id,
                error: { message: 'No existe el Medico' }
            });
        }

        itemValid.nombre = body.name;
        itemValid.img = body.img;
        itemValid.hospital = body.hospital_id;

        itemValid.save((err, itemSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar Medico',
                    error: err
                });
            }
            res.status(200).json({
                ok: true,
                user: itemSaved
            });
        });

    });
});

// ======================================
// Eliminar Medico
// ======================================
app.delete('/:id', mdaAthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    MedicoModel.findByIdAndRemove(id).exec((err, itemDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar Medico',
                error: err
            });
        }
        if (!itemDeleted) {
            return res.status(404).json({
                ok: false,
                message: 'Error al buscar Medico ' + id,
                error: { message: 'No existe el Medico' }
            });
        }

        res.status(200).json({
            ok: true,
            user: itemDeleted
        });

    });
});

module.exports = app;