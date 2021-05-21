'use strict'

const express = require('express')
const reservacionController = require('../controllers/reservacionController')

var md_autenticacion = require('../middlewares/authenticated')

var api = express.Router()


module.exports = api;