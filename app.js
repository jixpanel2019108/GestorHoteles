'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

const usuario_ruta = require('./src/routes/usuarioRoutes')
const hotel_ruta = require('./src/routes/hotelRoutes')
const habitacion_ruta = require('./src/routes/habitacionRoutes')
const tipoEvento_ruta = require('./src/routes/tipoEventoRoutes')
const evento_ruta = require('./src/routes/eventoRoutes')
const servicio_ruta = require('./src/routes/servicioRoutes')
const reservacion_ruta = require('./src/routes/reservacionRoutes')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', usuario_ruta, hotel_ruta, habitacion_ruta, tipoEvento_ruta, evento_ruta, servicio_ruta, reservacion_ruta)

module.exports = app;