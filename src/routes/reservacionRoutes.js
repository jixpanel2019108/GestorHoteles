'use strict'

const express = require('express')
const reservacionController = require('../controllers/reservacionController')

var md_autenticacion = require('../middlewares/authenticated')

var api = express.Router()
api.put('/agregarChekInOut/:idUsuario',md_autenticacion.ensureAuth, reservacionController.agregarChekInOut)
api.put('/reservarHabitacion/:idHabitacion',md_autenticacion.ensureAuth, reservacionController.reservarHabitacion)
api.put('/agregarServiciosReservacion/:idServicio',md_autenticacion.ensureAuth, reservacionController.agregarServiciosReservacion)
api.get('/obtenerServiciosReservacion',md_autenticacion.ensureAuth, reservacionController.obtenerServiciosReservacion)
api.get('/obtenerServiciosFactura',md_autenticacion.ensureAuth, reservacionController.obtenerServiciosFactura)
api.put('/eliminarServicioReservacion/:idServicio',md_autenticacion.ensureAuth, reservacionController.eliminarServicioReservacion)
api.post('/actualizarTotal', md_autenticacion.ensureAuth,reservacionController.actualizarTotal)
api.put('/agregarPrecio/:idHabitacion', md_autenticacion.ensureAuth,reservacionController.agregarPrecio)
api.put('/agregarFactura', md_autenticacion.ensureAuth, reservacionController.agregarFactura)
api.get('/obtenerFacturasUsuario', md_autenticacion.ensureAuth, reservacionController.obtenerFacturasUsuario)
api.get('/obtenerHotelHabitacion/:idHabitacion', md_autenticacion.ensureAuth, reservacionController.obtenerHotelHabitacion)

module.exports = api;