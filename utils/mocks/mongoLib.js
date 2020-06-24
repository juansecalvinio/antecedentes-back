const sinon = require('sinon');

const { personsMock } = require('./persons');

const getAllStub = sinon.stub();
getAllStub.withArgs('persons').resolves(personsMock);

const createStub = sinon.stub().resolves(personsMock[0].id);

class MongoLibMock {
    getAll(collection) {
        return getAllStub(collection)
    }

    create(collection, data) {
        return createStub(collection, data);
    }
}

module.exports = {
    getAllStub,
    createStub,
    MongoLibMock
}