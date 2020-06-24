const joi = require('@hapi/joi');

const antecIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const antecNameSchema = joi.string().max(200);

const createAntecSchema = {
    name: antecNameSchema.required(),
};

const udpateAntecSchema = {
    name: antecNameSchema,
}

module.exports = {
    antecIdSchema,
    createAntecSchema,
    udpateAntecSchema
}