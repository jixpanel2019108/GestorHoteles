'use strict'
const express = require('express')
const servicioController = require('../controllers/servicioController')
var md_autenticacion = require('../middlewares/authenticated');

api = express.Router()
api.post('/agregarServicio', md_autenticacion.ensureAuth, servicioController.agregarServicio)
api.get('/obtenerServiciosHotel/:idHotel', md_autenticacion.ensureAuth, servicioController.obtenerServiciosHotel)
api.delete('/eliminarServicio/:idServicio', md_autenticacion.ensureAuth, servicioController.eliminarServicio)
api.put('/actualizarServicio/:idServicio', md_autenticacion.ensureAuth, servicioController.actualizarServicio)

module.exports = api;

