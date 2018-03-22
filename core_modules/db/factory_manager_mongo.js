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
            this.model.create(item, (err, itemSave) => {

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
    find(filter) {}

    /**
     * Finds an item on data base by its Id
     * 
     * @param {String} id Id of the item
     * @memberof DataManager
     * @return {Promise} promise to be handle
     */
    findById(id) {}

    /**
     * Finds one item on data base
     * 
     * @param {Object} filter JSON that filters the information of the search
     * @memberof DataManager
     * @return {Promise} promise to be handle
     */
    findOne(filter) {}

    /**
     * Updates for one item on data base
     * 
     * @param {Object} newData JSON that has the information of the item.
     * @memberof DataManager
     * @return {Promise} promise to be handle
     */
    update(newData) {}

    /**
     * Removes an item on data base it returns null
     * 
     * @param {Object} filter SON that filters the information of the search
     * @memberof DataManager
     * @return {Promise} promise to be handle
     */
    remove(filter) {}

}

module.exports = FactoryMongoDataManager;