const joi = require('@hapi/joi');
const ID_SCHEMA = require('./../utils/constants');

const { personIdSchema } = require('./persons');
const { antecIdSchema } = require('./antecs');

const personAntecIdSchema = ID_SCHEMA;

const createPersonAntec = {
    personId: personIdSchema,
    antecId: antecIdSchema
}

module.exports = {
    personAntecIdSchema,
    createPersonAntec
}