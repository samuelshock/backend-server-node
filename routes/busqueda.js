var express = require('express');

var app = express();

var HospitalModel = require("../models/hospital");
var MedicoModel = require("../models/medico");
var UserModel = require("../models/user");



// ================================
// Busqueda por coleccion
// ================================
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, "i");
    var tabla = req.params.tabla;

    var finder = null;
    switch (tabla) {
        case "medicos":
            {
                finder = findMedicos(regex);
                break;
            }
        case "hospitales":
            {
                finder = findHospitals(regex);
                break;
            }
        case "usuarios":
            {
                finder = findUsers(regex);
                break;
            }
        default:
            {
                return res.status(400).json({
                    ok: false,
                    message: 'Error',
                    error: { message: "No existe la coleccion." }
                });
            }
    }

    finder.then(result => {
        res.status(200).json({
            ok: true,
            [tabla]: result
        });
    }).catch(err => {
        res.status(500).json({
            ok: false,
            message: 'Error',
            error: err
        });
    });


});


// ================================
// Busqueda general
// ================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, "i");

    Promise.all(
        [
            findHospitals(regex),
            findMedicos(regex),
            findUsers(regex)
        ]
    ).then(result => {
        res.status(200).json({
            ok: true,
            hospitales: result[0],
            medicos: result[1],
            users: result[2]
        });
    }).catch(err => {
        res.status(500).json({
            ok: false,
            message: 'Error',
            error: err
        });
    });
});

function findHospitals(regex) {
    return new Promise((resolve, reject) => {
        HospitalModel.find({ nombre: regex })
            .populate("user", "name email")
            .exec((err, result) => {
                if (err) reject("Error al cargar horpitales: ", err);
                resolve(result);
            });
    });
}

function findMedicos(regex) {
    return new Promise((resolve, reject) => {
        MedicoModel.find({ nombre: regex })
            .populate("user", "name email")
            .populate("hospital")
            .exec((err, result) => {
                if (err) reject("Error al cargar medicos: ", err);
                resolve(result);
            });
    });
}

function findUsers(regex) {
    return new Promise((resolve, reject) => {
        UserModel.find({}, "name img email role google")
            .or([{ name: regex }, { email: regex }])
            .exec((err, result) => {
                if (err) reject("Error al cargar usuarios: ", err);
                resolve(result);
            });
    });
}


module.exports = app;