const joi = require('@hapi/joi');

const personIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const personFirstNameSchema = joi.string().max(100);
const personLastNameSchema = joi.string().max(100);
const personCuitSchema = joi.string();
const personAgeSchema = joi.number().min(18).max(100);
const personActiveSchema = joi.boolean().default(true);

const createPersonSchema = {
    firstName: personFirstNameSchema.required(),
    lastName: personLastNameSchema.required(),
    cuit: personCuitSchema.required(),
    age: personAgeSchema.required(),
    active: personActiveSchema
};

const udpatePersonSchema = {
    firstName: personFirstNameSchema,
    lastName: personLastNameSchema,
    cuit: personCuitSchema,
    age: personAgeSchema,
    active: personActiveSchema,
}

module.exports = {
    personIdSchema,
    createPersonSchema,
    udpatePersonSchema
}