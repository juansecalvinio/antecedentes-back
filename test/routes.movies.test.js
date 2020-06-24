const assert = require('assert');
const proxyquire = require('proxyquire');

const { personsMock, PersonsServicesMock } = require('./../utils/mocks/persons');
const testServer = require('./../utils/testServer');

describe('routes - persons', function() {
    const route = proxyquire('./../routes/persons', {
        './../services/persons': PersonsServicesMock
    })

    const request = testServer(route);

    describe('GET /persons', function() {
        it('Should respond status 200', function(done){
            request.get('/api/persons').expect(200, done);
        });

        it('Should respond with list of persons', function(done){
            request.get('/api/persons').end((err, res) => {
                assert.deepEqual(res.body, {
                    data: personsMock,
                    message: 'Personas listadas'
                })

                done();
            })
        })
    })
})