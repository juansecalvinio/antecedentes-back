const express = require('express');
const cors = require('cors');
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
app.use(cors());

// routes
authApi(app);
antecsApi(app);
personsApi(app);
personsAntecsApi(app);

// catch 404
app.use(notFoundHandler);

// error middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function(){
    console.log(`Listening http://localhost:${config.port}`);
});