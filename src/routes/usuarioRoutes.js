'use strict'

const express = require('express')
const usuarioController = require('../controllers/usuarioController')

var md_autenticacion = require('../middlewares/authenticated')

var api = express.Router()
api.post('/registrarUsuario', usuarioController.registrarUsuario)

module.exports = api