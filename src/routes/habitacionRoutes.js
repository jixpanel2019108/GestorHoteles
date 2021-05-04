'use Strict'
const express = require('express')
const habitacionController = require('../controllers/habitacionController')

var md_autenticacion = require('../middlewares/authenticated')

api = express.Router()
api.post('/registrarHabitacion/:idHotel', md_autenticacion.ensureAuth, habitacionController.registrarHabitacion)
module.exports = api