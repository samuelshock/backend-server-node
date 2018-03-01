var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require("fs");

var app = express();

var HospitalModel = require("../models/hospital");
var MedicoModel = require("../models/medico");
var UserModel = require("../models/user");

// default options
app.use(fileUpload());


app.put('/:tipo/:id', function(req, res) {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de coleccion
    var tiposValidos = ["hospitales", "medicos", "usuarios"];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Tipo de coleccion no es valida',
            error: { message: "Coleccion no valida." }
        });
    }

    console.log(req.files);

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No selecciono nada',
            error: { message: "Debe de seleccionar una imagen." }
        });
    }

    // Obtener nombre del archivo
    var fileUpload = req.files.imagen;
    var nameSplit = fileUpload.name.split(".");
    var extensionFile = nameSplit[nameSplit.length - 1];

    var validExtension = ["png", "jpg", "gif", "jpeg"];

    if (validExtension.indexOf(extensionFile) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extension no valida',
            error: { message: "las extensiones validas son: " + validExtension.join(", ") }
        });
    }

    // Nombre de archivo personalizado
    // 
    var fileName = `${id}-${ new Date().getMilliseconds()}.${extensionFile}`;

    // Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${fileName}`;

    fileUpload.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al mover archivo.',
                error: err
            });
        }

        uploadbyType(tipo, id, fileName, res);
        /*res.status(200).json({
            ok: true,
            message: 'Peticion realizada correctamente - archivo movido'
        });*/
    });
});

function uploadbyType(type, id, fileName, res) {
    if (type === "usuarios") {
        UserModel.findById(id, (err, user) => {
            var lastPath = "./uploads/usuarios/" + user.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(lastPath)) {
                fs.unlink(lastPath);
            }

            user.img = fileName;

            user.save((err, userSaved) => {
                return res.status(200).json({
                    ok: true,
                    message: 'Imagen actualizada',
                    usuario: userSaved
                });
            });

        });
    }
}

module.exports = app;