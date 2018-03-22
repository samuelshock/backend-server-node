const mongoFactory = require('../core_modules/db/factory_manager_mongo');


module.exports.getDBFactory = (choice, model) => {
    if (choice == 'mongodb') {
        return new mongoFactory(model);
    }
}