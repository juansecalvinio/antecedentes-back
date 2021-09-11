const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const { config } = require('./config/index.js');

const authApi = require('./routes/auth');
const googleAuthApi = require('./routes/googleAuth');
const antecsApi = require('./routes/antecs');
const personsApi = require('./routes/persons');
const afipApi = require('./routes/afip');

const { logErrors, wrapErrors, errorHandler } = require('./utils/middleware/errorHandlers');
const notFoundHandler = require('./utils/middleware/notFoundHandler');

// Middlewares

// body parser
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// set session
app.use(session({
    secret: config.authJwtSecret,
    resave: true,
    saveUninitialized: true
}));

// routes
authApi(app);
googleAuthApi(app);
antecsApi(app);
personsApi(app);
afipApi(app);

// catch 404
app.use(notFoundHandler);

// error middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function(){
    console.log(`Listening http://localhost:${config.port}`);
});