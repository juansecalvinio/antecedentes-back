const express = require('express');
const app = express();

const cors = require('cors');

// Indico la url del frontend para permitirle el cruce de datos
const corsOptions = { origin: "http://localhost:3000" };
app.use(cors(corsOptions));

// Middleware body parser
app.use(express.json());

app.listen('5000', function(){
    console.log('Listening https://localhost:5000');
});