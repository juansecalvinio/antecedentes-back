const MongoLib = require('./../lib/mongo');

class AntecsServices {
    constructor() {
        this.collection = 'antecedentes';
        this.mongoDB = new MongoLib()
    }

    async getAntecs({ tags }) {
        const query = tags && { tags: { $in: tags }};
        const antecs = await this.mongoDB.getAll(this.collection, query);
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