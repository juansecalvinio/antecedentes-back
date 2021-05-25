const express = require('express');
const passport = require('passport');
const AntecsServices = require('./../services/antecs');

const antecsServices = new AntecsServices();

const scopeValidationHandler = require('./../utils/middleware/scopesValidationHandler');

// JWT strategy
// require('../utils/auth/strategies/jwt');

function antecsApi(app) {
    const router = express.Router();
    app.use("/api/antecs", router);

    // Get all
    router.get("/", 
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['read:antecedentes']),
        async function(req, res, next) {
            const { tags } = req.query;

            try {
                const antecs = await antecsServices.getAntecs({ tags });
                console.log(antecs)
                res.status(200).json({
                    data: antecs,
                    message: 'Antecedentes listados'
                })
            } catch (err) {
                next(err);
            }
        }
    )

    // Get by id
    router.get("/:id", 
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['read:antecedentes']),
        async function(req, res, next) {
            const { id } = req.params;
            try {
                const antec = await antecsServices.getAntec({ id });

                res.status(200).json({
                    data: antec,
                    message: 'Antecedente encontrado'
                })
            } catch (err) {
                next(err);
            }
        }
    )

    // GetAll by ids
    router.post("/ids", 
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['read:antecedentes']),
        async function(req, res, next) {
            const { ids } = req.body;
            console.log(ids);
            try {
                const antecs = await antecsServices.getAntecsByIds(ids);

                res.status(200).json({
                    data: antecs,
                    message: 'Antecedentes encontrados'
                })
            } catch (err) {
                next(err);
            }
        }
    )

    // Create antec
    router.post("/", 
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['create:antecedentes']),
        async function(req, res, next) {
        const { body: antec } = req;
        try {
            const createdAntecId = await antecsServices.registerAntec({ antec });

            res.status(201).json({
                data: createdAntecId,
                message: 'Antecedente registrado en la base de datos'
            })
        } catch (err) {
            next(err);
        }
    })

    // Edit person
    router.put("/:id", 
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['update:antecedentes']),
        async function(req, res, next) {
        const { id } = req.params;
        const { body: antec } = req;
        try {
            const updatedAntecId = await antecsServices.updateAntec({ id, antec });

            res.status(200).json({
                data: updatedAntecId,
                message: 'Antecedente actualizado en la base de datos'
            })
        } catch (err) {
            next(err);
        }
    })

    // Delete antec
    router.delete("/:id", 
        // passport.authenticate('jwt', { session: false }),
        // scopeValidationHandler(['delete:antecedentes']),
        async function(req, res, next) {
            const { id } = req.params;
            try {
                const deletedAntecId = await antecsServices.deleteAntec({ id });

                res.status(200).json({
                    data: deletedAntecId,
                    message: 'Antecedente eliminado de la base de datos'
                })
            } catch (err) {
                next(err);
            }
        }
    )
}

module.exports = antecsApi;