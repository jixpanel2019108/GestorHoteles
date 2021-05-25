'use strict'
const express = require('express')
const eventoController = require('../controllers/eventoController')
const md_autenticacion = require('../middlewares/authenticated')


var api = express.Router()
api.post('/registrarEvento', md_autenticacion.ensureAuth, eventoController.registrarEvento);
api.get('/obtenerEventosHotel/:idHotel', md_autenticacion.ensureAuth, eventoController.obtenerEventosHotel);
api.get('/obtenerEventosIdHotel/:idHotel', md_autenticacion.ensureAuth, eventoController.obtenerEventosIdHotel);
api.get('/obtenerEventosCategorias/:idHotel/:idTipo', md_autenticacion.ensureAuth, eventoController.obtenerEventosCategorias)


module.exports = api

//TODO: Verificar bien las funciones que hara cada quien