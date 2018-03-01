var express = require('express');

var mdaAthentication = require('../middlewares/authentication');

var app = express();

var HospitalModel = require('../models/hospital');

// ======================================
// Obtener Todos los Hospitales
// ======================================
app.get('/', (req, res, next) => {

    var since = req.query.since || 0;
    since = Number(since);

    HospitalModel.find({})
        .skip(since)
        .limit(5)
        .populate("user", "name email")
        .exec(
            (err, items) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error cargando Hospitales',
                        error: err
                    });
                }
                HospitalModel.count({}, (err, counter) => {
                    res.status(200).json({
                        ok: true,
                        hospitales: items,
                        total: counter
                    });
                });

            });
});


// ======================================
// Crear un Hospital
// ======================================
app.post('/', mdaAthentication.verifyToken, (req, res) => {

    var body = req.body;

    var newItem = new HospitalModel({
        nombre: body.name,
        img: body.email,
        user: req.user._id
    });


    newItem.save((err, itemSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear Hospital',
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
// Actualizar Hospital
// ======================================
app.put('/:id', mdaAthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    HospitalModel.findById(id).exec((err, itemValid) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar Hospital',
                error: err
            });
        }

        if (!itemValid) {
            return res.status(404).json({
                ok: false,
                message: 'Error al buscar Hospital ' + id,
                error: { message: 'No existe el Hospital' }
            });
        }

        itemValid.nombre = body.name;
        itemValid.img = body.img ? body.img : itemValid.img || "";
        itemValid.user = req.user._id;

        itemValid.save((err, itemSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar Hospital',
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
// Eliminar Hospital
// ======================================
app.delete('/:id', mdaAthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    HospitalModel.findByIdAndRemove(id).exec((err, itemDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar Hospital',
                error: err
            });
        }
        if (!itemDeleted) {
            return res.status(404).json({
                ok: false,
                message: 'Error al buscar Hospital ' + id,
                error: { message: 'No existe el Hospital' }
            });
        }

        res.status(200).json({
            ok: true,
            user: itemDeleted
        });

    });
});

module.exports = app;