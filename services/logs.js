const MongoLib = require('./../lib/mongo');

class LogsServices {
    constructor() { 
        this.collection = 'log';
        this.mongoDB = new MongoLib();
    }

    registerLog({ log }) {
        try {
            this.mongoDB.create(this.collection, log);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = LogsServices;