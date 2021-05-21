'use strict'

const express = require('express')
const hotelController = require('../controllers/hotelController')

var md_autenticacion = require('../middlewares/authenticated')

var api = express.Router()
    // api.post('/registrarHotel', md_autenticacion.ensureAuth, hotelController)
api.post('/registrarHotel', md_autenticacion.ensureAuth, hotelController.registrarHotel);
api.get('/obtenerHoteles',hotelController.obtenerHoteles) 
api.get('/obtenerHotelesPais/:idPais',hotelController.obtenerHotelesPais) 

module.exports = api;