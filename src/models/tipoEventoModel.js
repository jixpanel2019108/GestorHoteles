'use strict'
const mongoose = require('mongoose')
var Schema = mongoose.Schema

var TipoEventoSchema = Schema({
    tipo: String
})

module.exports = mongoose.model('tipoEventos', TipoEventoSchema)