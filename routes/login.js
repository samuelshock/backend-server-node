var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;

var app = express();

var UserModel = require('../models/user');

var { OAuth2Client } = require('google-auth-library');

// =================================
// Autenticacion de Google
// ================================= 

app.post('/google', (req, res, next) => {

    var token = req.body.token;

    var client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');
    async(function verify() {
        const ticket = await (client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        }));
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        //const domain = payload['hd'];

        UserModel.findOne({ email: payload.email }, (err, userDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al buscar Usuario',
                    error: err
                });
            }

            if (userDB) {
                if (userDB.google) {
                    // create token!!
                    userDB.password = ':)';
                    var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 });
                    res.status(200).json({
                        ok: true,
                        user: userDB,
                        token: token,
                        id: userDB._id,
                        menu: getMenu(userDB.role)
                    });
                } else {
                    return res.status(400).json({
                        ok: false,
                        message: 'Debe de usar su autenticacion normal'
                    });
                }
            } else {
                var newUser = new UserModel();

                newUser.name = payload.name;
                newUser.email = payload.email;
                newUser.password = ':)';
                newUser.img = payload.picture;
                newUser.google = true;

                newUser.save((err, user) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error al Crear Usuario',
                            error: err
                        });
                    }
                    user.password = ':)';
                    var token = jwt.sign({ user: user }, SEED, { expiresIn: 14400 });

                    res.status(200).json({
                        ok: true,
                        user: user,
                        token: token,
                        id: user._id,
                        menu: getMenu(user.role)
                    });
                });
            }
        });

    });

    verify().catch(err => {
        return res.status(500).json({
            ok: false,
            message: 'Error al autenticar usuario',
            error: err
        });
    });

});

// =================================
// Autenticacion normal
// ================================= 
app.post('/', (req, res, next) => {

    var body = req.body;

    UserModel.findOne({ email: body.email }, (err, userDB) => {

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
            id: userDB._id,
            menu: getMenu(userDB.role)
        });
    });
});

function getMenu(ROLE) {
    var menu = [{
            title: 'MainMenu',
            icon: 'mdi mdi-gauge',
            submenu: [
                { title: 'Dashboard', url: '/dashboard' },
                { title: 'ProgressBar', url: '/progress' },
                { title: 'Grafica', url: '/graficas1' },
                { title: 'Promesas', url: '/promesas' },
                { title: 'RXJS', url: '/rxjs' }
            ]
        },
        {
            title: 'Mantenimiento',
            icon: 'mdi mdi-folder-lock-open',
            submenu: [
                { title: 'Hospitales', url: '/hospitales' },
                { title: 'Medicos', url: '/medicos' }
            ]
        }
    ];
    if (ROLE === "ADMIN_ROLE") {
        menu[1].submenu.unshift({ title: 'Usuarios', url: '/usuarios' });
    }

    return menu;
}

module.exports = app;