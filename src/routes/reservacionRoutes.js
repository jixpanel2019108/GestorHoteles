'use strict'

const express = require('express')
const reservacionController = require('../controllers/reservacionController')

var md_autenticacion = require('../middlewares/authenticated')

var api = express.Router()
api.put('/agregarChekInOut/:idUsuario',md_autenticacion.ensureAuth, reservacionController.agregarChekInOut)
api.put('/reservarHabitacion/:idHabitacion',md_autenticacion.ensureAuth, reservacionController.reservarHabitacion)

module.exports = api;