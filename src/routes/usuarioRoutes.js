'use strict'

const express = require('express')
const usuarioController = require('../controllers/usuarioController')

var md_autenticacion = require('../middlewares/authenticated')

var api = express.Router()
api.post('/registrarUsuario', usuarioController.registrarUsuario)
api.put('/editarUsuario', md_autenticacion.ensureAuth, usuarioController.editarUsuario)
api.post('/login', usuarioController.login)
api.delete('/eliminarUsuario', md_autenticacion.ensureAuth, usuarioController.eliminarUsuario)
module.exports = api