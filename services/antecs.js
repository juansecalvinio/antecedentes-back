const MongoLib = require('./../lib/mongo');
const { ObjectId } = require('mongodb');

class AntecsServices {
    constructor() {
        this.collection = 'antecedentes';
        this.mongoDB = new MongoLib()
    }

    async getAntecs() {
        const antecs = await this.mongoDB.getAll(this.collection);
        return antecs || [];
    }

    async getAntecsByIds(ids) {
        const formatedIds = ids.map(id => ObjectId(id));
        const antecs = await this.mongoDB.getAll(this.collection, { _id: { $in: formatedIds } });
        return antecs || [];
    }

    async getAntec({ id }) {
        const antec = await this.mongoDB.get(this.collection, id);
        return antec || {};
    }

    async registerAntec({ antec }) {
        const registeredAntecId = await this.mongoDB.create(this.collection, antec);
        return registeredAntecId;
    }

    async updateAntec({ id, antec } = {}) {
        const updatedAntecId = await this.mongoDB.update(
            this.collection, 
            id, 
            antec
        );
        return updatedAntecId;
    }

    async deleteAntec({ id }) {
        const deletedAntecId = await this.mongoDB.delete(this.collection, id);
        return deletedAntecId;
    }
}

module.exports = AntecsServices;