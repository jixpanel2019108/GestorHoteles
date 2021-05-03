'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

const usuario_ruta = require('./src/routes/usuarioRoutes')
const hotel_ruta = require('./src/routes/hotelRoutes')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', usuario_ruta, hotel_ruta)

module.exports = app;