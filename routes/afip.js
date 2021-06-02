const express = require('express');
const AfipServices = require('./../services/afip');
const LogsServices = require('./../services/logs');

const afipServices = new AfipServices();
const logsServices = new LogsServices();

function afipApi(app) {
    const router = express.Router();
    app.use("/api/afip", router);

    // WS Afip PersonaServiceA13
    router.get("/:cuit",
        async function(req, res, next) {
            const { cuit } = req.params;
            try {
                let log = {
                    method: "GET",
                    collection: 'afip',
                    description: `Consulta a AFIP con el CUIT: ${cuit}`
                }

                logsServices.registerLog({ log });

                const person = await afipServices.getPersonAFIP(cuit);
                
                res.status(200).json({
                    data: person,
                    message: 'Información respondida de AFIP'
                })
            } catch (err) {
                next(err);
            }
        }
    )
}

module.exports = afipApi;