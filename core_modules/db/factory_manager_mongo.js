const LIMIT = require('../../config/config').LIMIT_PER_REQUEST;

/**
 * Handles basic operations with data base
 * 
 * @class DataManager
 */
class FactoryMongoDataManager {
    /**
     * Creates an instance of DataManager.
     * @param {any} dataModel 
     * @memberof DataManager
     */
    constructor(dataModel) {
        console.log('constructor ');
        this.model = dataModel;
    }

    /**
     * Creates a new item on data base
     * 
     * @param {Object} record 
     * @memberof DataManager the item to save
     * @return {Promise} promise to be handle
     */
    create(record) {
        return new Promise((resolve, reject) => {
            this.model.create(record, (err, itemSave) => {
                if (err) reject(err);
                resolve(itemSave);
            });
        });
    }

    /**
     * Finds items on data base
     * 
     * @param {Object} filter JSON that filters the information of the search
     * @memberof DataManager 
     * @return {Promise} promise to be handle
     */
    find(filter, params, since) {
        return new Promise((resolve, reject) => {
            if (params.hasOwnProperty('fields')) {
                params['fields'] = params['fields'].join(' ');
            } else {
                params['fields'] = '';
            }
            var query = this.model.find(filter, params['fields']);
            if (params.hasOwnProperty('paginate') && params['paginate']) {
                query.skip(since);
                query.limit(LIMIT);
            }
            if (params.hasOwnProperty('sortBy')) {
                var sortBy = filter.sortBy;
                query.sort(sortBy);
            }
            query.exec(filter, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * 
     * 
     * @param {any} filter 
     * @returns 
     * @memberof FactoryMongoDataManager
     */
    modelCount(filter) {
        filter = filter || {};
        return new Promise((resolve, reject) => {
            this.model.count(filter, (err, counter) => {
                if (err) reject(err);
                resolve(counter);
            });
        });
    }

    /**
     * Finds an item on data base by its Id
     * 
     * @param {String} id Id of the item
     * @memberof DataManager
     * @return {Promise} promise to be handle
     */
    findById(id) {
        return new Promise((resolve, reject) => {
            this.model.findById(id).exec((err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        });
    }

    /**
     * Finds one item on data base
     * 
     * @param {Object} filter JSON that filters the information of the search
     * @memberof DataManager
     * @return {Promise} promise to be handle
     */
    findOne(filter) {
        return new Promise((resolve, reject) => {
            this.model.findOne(filter, (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        });
    }

    /**
     * Updates for one item on data base
     * 
     * @param {Object} newData JSON that has the information of the item.
     * @memberof DataManager
     * @return {Promise} promise to be handle
     */
    update(id, newData) {
        return new Promise((resolve, reject) => {
            this.findById(id).then(record => {
                for (let attribute in newData) {
                    record[attribute] = newData[attribute];
                }
                record.save((err, data) => {
                    console.log(data);
                    if (err) reject(err);
                    resolve(data);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * Removes an item on data base it returns null
     * 
     * @param {Object} filter SON that filters the information of the search
     * @memberof DataManager
     * @return {Promise} promise to be handle
     */
    remove(id) {
        return new Promise((resolve, reject) => {
            this.model.findByIdAndRemove(id).exec((err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }
}

module.exports = FactoryMongoDataManager;