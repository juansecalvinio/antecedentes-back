const assert = require('assert');
const buildMessage = require('../utils/buildMessage');

describe('utils - buildMessage', function() {
    describe('when recieves an entity and an action', function() {
        it('should return the respective message', function() {
            const result = buildMessage('person', 'create');
            const expect = "Persona registrada en la base de datos";
            assert.strictEqual(result, expect);
        })
    })
})