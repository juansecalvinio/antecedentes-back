const assert = require('assert');
const proxyquire = require('proxyquire');

const { MongoLibMock, getAllStub } = require('./../utils/mocks/mongoLib');

const { personsMocks } = require('./../utils/mocks/persons');

describe('services - persons', function(){
    
    const PersonsServices = proxyquire('../services/persons', {
        '../lib/mongo': MongoLibMock
    });

    const personsServices = new PersonsServices();
    
    describe("When getPersons method is called", async function(){
        
        it('Should call the getAll MongoLig method', 
        async function(){
            await personsServices.getPersons({});
            assert.strictEqual(getAllStub.called, true);
        })

        it("Should return an array of persons", 
        async function(){
            const result = await personsServices.getPersons({});
            console.log(result);
            const expected = personsMocks;
            assert.deepEqual(result, expected);
        })
    })
})