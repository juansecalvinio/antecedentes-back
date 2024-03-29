const express = require('express');
// const passport = require('passport'); 
const LogsServices = require('./../services/logs');
const PersonsServices = require('./../services/persons');
const { personIdSchema, udpatePersonSchema } = require('./../schemas/persons');

const validationHandler = require('./../utils/middleware/validationHandler');
// const scopeValidationHandler = require('./../utils/middleware/scopesValidationHandler');

const cacheResponse = require('./../utils/cacheResponse');
const { 
    SIXTY_MINUTES_TO_SECONDS
} = require('./../utils/time');

const logsServices = new LogsServices();
const personsServices = new PersonsServices();

// JWT strategy
// require('../utils/auth/strategies/jwt');

function personsApi(app) {
    const router = express.Router();
    app.use("/api/persons", router);

    // Get all
    router.get("/", 
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['read:personas']),
        async function(req, res, next) {
            cacheResponse(res, SIXTY_MINUTES_TO_SECONDS);
            const { tags } = req.query;
    
            try {
                const persons = await personsServices.getPersons({ tags });

                res.status(200).json({
                    data: persons,
                    message: 'Personas listadas'
                })
            } catch (err) {
                next(err);
            }
        }
    )

    // Get by cuit
    router.get("/cuit/:cuit",
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['read:personas']),
        async function(req, res, next) {
            cacheResponse(res, SIXTY_MINUTES_TO_SECONDS);
            const { cuit } = req.params;
            try {
                const person = await personsServices.getPersonByCuit({ cuit });
                res.status(200).json({
                    data: person,
                    message: 'Persona encontrada'
                })
            } catch (err) {
                next(err);
            }
        }
    )

    // Get by id
    router.get("/id/:id", 
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['read:personas']),
        validationHandler({ id: personIdSchema }, 'params'),
        async function(req, res, next) {
            cacheResponse(res, SIXTY_MINUTES_TO_SECONDS);
            const { id } = req.params;

            try {
                const persons = await personsServices.getPerson({ id });

                res.status(200).json({
                    data: persons,
                    message: 'Persona encontrada'
                })
            } catch (err) {
                next(err);
            }
        }
    )

    // Create person
    router.post("/",
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['create:personas']),
        // validationHandler(createPersonSchema),
        async function(req, res, next) {
            const { body: person } = req;
            try {
                const createdPersonId = await personsServices.registerPerson({ person });
                let log = {
                    method: "POST",
                    collection: 'personas',
                    description: `Registro agregado: ${createdPersonId}`
                }
                logsServices.registerLog({ log });
                res.status(201).json({
                    data: createdPersonId,
                    message: 'Persona registrada en la base de datos'
                })
            } catch (err) {
                next(err);
            }
        }
    )

    // Edit person
    router.put("/:id", 
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['update:personas']),
        validationHandler({ id: personIdSchema }, 'params'), 
        validationHandler(udpatePersonSchema),
        async function(req, res, next) {
            const { id } = req.params;
            const { body: person } = req;
            try {
                const updatedPersonId = await personsServices.updatePerson({ id, person });
                let log = {
                    method: "PUT",
                    collection: 'personas',
                    description: `Registro modificado: ${updatedPersonId}`
                }
                logsServices.registerLog({ log })
                res.status(200).json({
                    data: updatedPersonId,
                    message: 'Persona actualizada en la base de datos'
                })
            } catch (err) {
                next(err);
            }
        }
    );

    // Delete person
    router.delete("/:id",
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['delete:personas']),
        validationHandler({ id: personIdSchema }), 
        async function(req, res, next) {
            const { id } = req.params;
            try {
                const deletedPersonId = await personsServices.deletePerson({ id });
                let log = {
                    method: "DELETE",
                    collection: 'personas',
                    description: `Registro eliminado: ${deletedPersonId}`
                }
                logsServices.registerLog({ log })
                res.status(200).json({
                    data: deletedPersonId,
                    message: 'Persona eliminada de la base de datos'
                })
            } catch (err) {
                next(err);
            }
        }
    )
}

module.exports = personsApi;