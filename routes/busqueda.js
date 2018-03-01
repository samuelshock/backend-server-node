var express = require('express');

var app = express();

var HospitalModel = require("../models/hospital");
var MedicoModel = require("../models/medico");
var UserModel = require("../models/user");


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
        UserModel.find({}, "name email role")
            .or([{ name: regex }, { email: regex }])
            .exec((err, result) => {
                if (err) reject("Error al cargar usuarios: ", err);
                resolve(result);
            });
    });
}


module.exports = app;