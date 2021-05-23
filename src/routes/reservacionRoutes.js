'use strict'

const express = require('express')
const reservacionController = require('../controllers/reservacionController')

var md_autenticacion = require('../middlewares/authenticated')

var api = express.Router()
api.put('/agregarChekInOut/:idUsuario',md_autenticacion.ensureAuth, reservacionController.agregarChekInOut)

module.exports = api;