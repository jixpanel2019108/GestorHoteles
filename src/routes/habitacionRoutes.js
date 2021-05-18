'use Strict'
const express = require('express')
const habitacionController = require('../controllers/habitacionController')

var md_autenticacion = require('../middlewares/authenticated')

api = express.Router()
api.post('/registrarHabitacion', md_autenticacion.ensureAuth, habitacionController.registrarHabitacion);
api.get('/obtenerHabitaciones/:idHotel', habitacionController.obtenerHabitaciones)
api.get('/obtenerHabitacionesPorHotel/:idHotel', md_autenticacion.ensureAuth, habitacionController.obtenerHabitacionesPorHotel)
module.exports = api