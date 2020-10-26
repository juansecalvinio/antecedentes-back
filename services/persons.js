const MongoLib = require('./../lib/mongo');

class PersonsServices {
    constructor() {
        this.collection = 'personas';
        this.mongoDB = new MongoLib()
    }

    async getPersons() {
        const persons = await this.mongoDB.getAll(this.collection);
        return persons || [];
    }

    async getPerson({ id }) {
        const person = await this.mongoDB.get(this.collection, id);
        return person || {};
    }

    async getPersonByCuit({ cuit }) {
        const person = await this.mongoDB.getByParam(this.collection, 'cuit', cuit);
        return person || {};
    }

    async registerPerson({ person }) {
        const registeredPersonId = await this.mongoDB.create(this.collection, person);
        return registeredPersonId;
    }

    async updatePerson({ id, person } = {}) {
        const updatedPersonId = await this.mongoDB.update(
            this.collection, 
            id, 
            person
        );
        return updatedPersonId;
    }

    async deletePerson({ id }) {
        const deletedPersonId = await this.mongoDB.delete(this.collection, id);
        return deletedPersonId;
    }
}

module.exports = PersonsServices;