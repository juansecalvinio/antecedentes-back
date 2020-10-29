const express = require('express');
const app = express();

const { config } = require('./config/index.js');

const authApi = require('./routes/auth');
const antecsApi = require('./routes/antecs');
const personsApi = require('./routes/persons');
const personsAntecsApi = require('./routes/personsAntecs');


const { logErrors, wrapErrors, errorHandler } = require('./utils/middleware/errorHandlers');
const notFoundHandler = require('./utils/middleware/notFoundHandler');

// Middlewares 

// body parser
app.use(express.json());

// routes
authApi(app);
antecsApi(app);
personsApi(app);
personsAntecsApi(app);

// catch 404
app.use(notFoundHandler);

const cors = require('cors');

// Indico la url del frontend para permitirle el cruce de datos
const corsOptions = { origin: "http://localhost:3000" };
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));

// error middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function(){
    console.log(`Listening http://localhost:${config.port}`);
});