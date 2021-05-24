'use Strict'
const express = require('express')
const habitacionController = require('../controllers/habitacionController')

var md_autenticacion = require('../middlewares/authenticated')

api = express.Router()
api.post('/registrarHabitacion', md_autenticacion.ensureAuth, habitacionController.registrarHabitacion);
api.get('/obtenerHabitaciones/:idHotel', habitacionController.obtenerHabitaciones)
api.get('/obtenerHabitacionesPorHotel/:idHotel', md_autenticacion.ensureAuth, habitacionController.obtenerHabitacionesPorHotel)
api.get('/obtenerHabitacionesTrue/:idHotel', md_autenticacion.ensureAuth, habitacionController.obtenerHabitacionesTrue)
api.get('/obtenerHabitacionId/:idHabitacion', md_autenticacion.ensureAuth, habitacionController.obtenerHabitacionId)
module.exports = api