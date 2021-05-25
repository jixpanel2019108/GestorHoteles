'use strict'

const express = require('express')
const hotelController = require('../controllers/hotelController')

var md_autenticacion = require('../middlewares/authenticated')

var api = express.Router()
    // api.post('/registrarHotel', md_autenticacion.ensureAuth, hotelController)
api.post('/registrarHotel', md_autenticacion.ensureAuth, hotelController.registrarHotel);
api.get('/obtenerHoteles',hotelController.obtenerHoteles) 
api.get('/obtenerHotelesAll',hotelController.obtenerHotelesAll) 
api.get('/obtenerHotelesPais/:idPais',hotelController.obtenerHotelesPais) 
api.post('/obtenerHotelNombre', md_autenticacion.ensureAuth,hotelController.obtenerHotelNombre) 
api.get('/obtenerHotelId/:idHotel', md_autenticacion.ensureAuth, hotelController.obtenerHotelId)

module.exports = api;