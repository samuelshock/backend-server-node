const mapModules = require('./map');
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');

const isDirectory = source => lstatSync(source).isDirectory();
const getFoldersByPath = source =>
    readdirSync(source).map(name => join(source, name)).filter(isDirectory);

class ModuleFactoryProducer {

    constructor(modulesPath) {
        this.loadModules(modulesPath);
    }

    loadModules(root) {
        var folders = getFoldersByPath(root).map(name => name = name.split('\\')[1]);
        for (let i in folders) {
            var moduleName = folders[i];
            var modulePath = '/' + moduleName + '/';
            var files = readdirSync(root + modulePath);

            if (files.indexOf('__config_module.json') > -1) {
                modulePath = `.${root}/${ modulePath }__config_module`;
                var moduleConf = require(modulePath);
                if (moduleConf.api_name && moduleConf.route) {
                    var mod = {
                        name: moduleName,
                        route: './' + moduleName + moduleConf.route,
                        dependencies: moduleConf.dependencies || [],
                        model: moduleConf.model ? './' + moduleName + moduleConf.model : null,
                        middleware: moduleConf.middleware ? './' + moduleName + moduleConf.middleware : null,
                        api_name: moduleConf.api_name
                    }
                    mapModules.set(moduleName, mod);
                }
            }
        }
    }

    getModulesRoutes() {
        let errors = [];
        let routesPath = [];
        for (let i in mapModules.keys()) {
            var moduleConf = mapModules.get(mapModules.keys()[i]);
            if (this.existApi(moduleConf.api_name, mapModules.keys()[i])) {
                console.error(' API \x1b[31mError\x1b[0m  `%s` this api route are used with other module ', moduleConf.api_name, moduleConf.name);
            } else {
                if (moduleConf.dependencies.length > 0) {
                    let missing = this.missingDependency(moduleConf.dependencies);
                    if (missing.length > 0) {
                        errors.push({
                            message: 'Missing Dependency ' + missing + ' in module ' + moduleConf.name
                        });
                        console.error('\x1b[31mError\x1b[0m Missing Dependency `%s` in module ', missing, moduleConf.name);
                    } else {
                        routesPath.push({
                            route: moduleConf.api_name,
                            path: moduleConf.route
                        });
                    }
                } else {
                    routesPath.unshift({
                        route: moduleConf.api_name,
                        path: moduleConf.route
                    });
                }
            }
        }
        return { errors: errors, modules: routesPath };
    }

    existApi(api, name) {
        for (let i in mapModules.keys()) {
            if (api === mapModules.get(mapModules.keys()[i]).api_name && mapModules.keys()[i] !== name) {
                return true;
            }
        }
        return false;
    }

    missingDependency(dependencies) {
        let missing = [];
        for (let i in dependencies) {
            if (mapModules.indexOf(dependencies[i]) === -1) {
                missing.push(dependencies[i]);
            }
        }
        return missing;
    }
}

module.exports = ModuleFactoryProducer;