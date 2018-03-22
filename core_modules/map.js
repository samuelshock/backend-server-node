class Map {

    constructor() {
        this.data = {};
    }

    set(key, value) {
        this.data[key] = value;
    }

    get(key) {
        return this.data[key];
    }

    remove(key) {
        delete this.data[key];
    }

    indexOf(key) {
        var indexOf = -1;
        var index = 0;
        for (let key1 in this.keys()) {
            if (this.keys()[key1] == key) {
                indexOf = index;
                break;
            }
            index++;
        }
        return indexOf;
    }

    exists(key) {
        return this.data[key] ? true : false;
    }

    keys() {
        return Object.keys(this.data);
    }

    length() {
        return this.keys().length;
    }

    isEmpty() {
        for (let key in this.keys()) {
            return false;
        }
        return true;
    }
}

module.exports = new Map();