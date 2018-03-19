// import { verifyRole } from '../middlewares/authentication';

var express = require('express');
var router = express.Router();
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');
const managerModule = require('./manager.module');

const isDirectory = source => lstatSync(source).isDirectory();
const getFoldersByPath = source =>
    readdirSync(source).map(name => join(source, name)).filter(isDirectory);

const loadModulesRoutes = () => {
    var folders = getFoldersByPath('./modules').map(name => name = name.split('\\')[1]);
    for (let i in folders) {
        var moduleName = folders[i];
        var moduleInstall = true;
        var modulePath = '/' + moduleName + '/';
        var files = readdirSync('./modules' + modulePath);

        if (files.indexOf('__config_module.json') > -1) {
            modulePath = `.${ modulePath }__config_module`;
            var moduleConf = require(modulePath);
            if (moduleConf.dependencies && Object.keys(moduleConf.dependencies).length > 0) {
                for (let j in moduleConf.dependencies) {
                    if (folders.indexOf(moduleConf.dependencies[j]) === -1) {
                        moduleInstall = false;
                        console.error('Dependency error module `%s` please install the module ', moduleName, moduleConf.dependencies);
                    }
                }
            }
            if (moduleConf.api_name && moduleConf.route && moduleInstall) {
                var path = './' + moduleName + moduleConf.route;
                router.use('/' + moduleConf.api_name, require(path));
            }
        }
    }
}

loadModulesRoutes();


router.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        message: 'Peticion realizada correctamente'
    });
});

module.exports = router;