var express = require('express');
var router = express.Router();
const ModuleFactory = require('../core_modules/module.factory.producer');
const { MODULES_PATH } = require('../config/config');
const modulefactory = new ModuleFactory(MODULES_PATH);

const loadModulesRoutes = () => {
    return new Promise((resolve, reject) => {
        let modulesList = modulefactory.getModulesRoutes();
        for (let i in modulesList.modules) {
            try {
                router.use('/' + modulesList.modules[i].route, require(modulesList.modules[i].path));
            } catch (error) {
                reject(error);
            }
        }
        if (modulesList.errors.length > 0) {
            reject(modulesList.errors);
        } else {
            resolve(true);
        }
    });
}

loadModulesRoutes();

router.get('/load_modules', (req, res, next) => {
    loadModulesRoutes().then(res => {
        res.status(200).json({
            ok: true,
            message: 'Modulos cargados correctamente'
        });
    }).catch(err => {
        res.status(500).json({
            ok: false,
            message: "Error al cargar los modulos",
            error: err
        });
    });
});

router.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Peticion realizada correctamente'
    });
});

module.exports = router;