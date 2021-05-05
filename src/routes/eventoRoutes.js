'use strict'
const express = require('express')
const eventoController = require('../controllers/eventoController')
const md_autenticacion = require('../middlewares/authenticated')


var api = express.Router()
api.post('/registrarEvento/:idHotel/:idTipoEvento', md_autenticacion.ensureAuth, eventoController.registrarEvento)

module.exports = api

//TODO: Verificar bien las funciones que hara cada quien