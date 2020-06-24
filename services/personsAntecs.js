const MongoLib = require('../lib/mongo');

class PersonsAntecsServices {
    constructor() {
        this.collection = 'personas-antecedentes';
        this.mongoDB = new MongoLib();
    }

    async getPersonAntecs({ personId }) {
        const query = personId && { personId };
        const personAntecs =  await this.mongoDB.getAll(this.collection, query);
        return personAntecs || [];
    }

    async createPersonAntec({ personAntec }) {
        const createdPersonAntecId = await this.mongoDB.create(this.collection, personAntec);
        return createdPersonAntecId;
    }

    async deletePersonAntec({ personAntecId }) {
        const deletedPersonAntecId = await this.mongoDB.delete(this.collection, personAntecId);
        return deletedPersonAntecId;
    }
}

module.exports = PersonsAntecsServices;