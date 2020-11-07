const joi = require('@hapi/joi');

const personIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const personFirstNameSchema = joi.string().max(100);
const personLastNameSchema = joi.string().max(100);
const personDniSchema = joi.string();
const personCuitSchema = joi.string();
const personBirthdaySchema = joi.date();
const personAntecsSchema = joi.array().default([]);
const personActiveSchema = joi.boolean().default(true);

const createPersonSchema = {
    firstName: personFirstNameSchema.required(),
    lastName: personLastNameSchema.required(),
    dni: personDniSchema.required(),
    cuit: personCuitSchema.required(),
    birthday: personBirthdaySchema.required(),
    antecs: personAntecsSchema,
    active: personActiveSchema
};

const udpatePersonSchema = {
    firstName: personFirstNameSchema,
    lastName: personLastNameSchema,
    dni: personDniSchema,
    cuit: personCuitSchema,
    birthday: personBirthdaySchema,
    antecs: personAntecsSchema,
    active: personActiveSchema
}

module.exports = {
    personIdSchema,
    createPersonSchema,
    udpatePersonSchema
}