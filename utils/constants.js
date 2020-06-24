const joi = require('@hapi/joi');

const ID_SCHEMA = joi.string().regex(/^[0-9a-fA-F]{24}$/);

module.exports = ID_SCHEMA