const express = require('express');
const passport = require('passport');

const PersonsAntecsServices = require('./../services/personsAntecs');
const validationHandler = require('../utils/middleware/validationHandler');
const scopeValidationHandler = require('./../utils/middleware/scopesValidationHandler');

const { personIdSchema } = require('./../schemas/persons');
const { createPersonAntec } = require('./../schemas/personsAntecs');

const personsAntecsServices = new PersonsAntecsServices();

// JWT strategy
// require('../utils/auth/strategies/jwt');

function personsAntecsApi(app) {
    const router = express.Router();
    app.use('/api/persons-antecs', router);

    router.get('/', 
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['read:personas-antecedentes']),
        validationHandler({ personId: personIdSchema }, 'query'), 
        async function(req, res, next) {
            const { personId } = req.query;

            try {
                const personAntecs = await personsAntecsServices.getPersonAntecs({ personId });

                res.status(200).json({
                    data: personAntecs,
                    message: 'Antecedentes de la persona listados'
                })
            } catch (error) {
                next(error);
            }
        }
    );

    router.post('/',
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['create:personas-antecedentes']),
        validationHandler(createPersonAntec), 
        async function(req, res, next) {
            const { body: personAntec } = req;

            try {
                const createdPersonAntecsId = await personsAntecsServices.createPersonAntec({ 
                    personAntec 
                });

                res.status(201).json({
                    data: createdPersonAntecsId,
                    message: 'Antecedentes de la persona registrado en la base de datos'
                })
            } catch (error) {
                next(error);
            }
        }
    );

    router.delete('/:personAntecId', 
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['delete:personas-antecedentes']),
        validationHandler({ personAntecId: personIdSchema }, 'params'), 
        async function(req, res, next) {
            const { personAntecId } = req.params;

            try {
                const deletedPersonAntecId = await personsAntecsServices.deletePersonAntec({
                    personAntecId
                });

                res.status(201).json({
                    data: deletedPersonAntecId,
                    message: 'Antecedente de persona eliminado de la base de datos'
                })
            } catch (error) {
                next(error);
            }   
        }
    );
}

module.exports = personsAntecsApi;