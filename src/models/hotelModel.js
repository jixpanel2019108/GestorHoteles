'use strict'

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var HotelSchema = Schema({
    nombre: String,
    pais: String,
    puntuacion: Number,
    direccion: String
})

module.exports = mongoose.model('hoteles', HotelSchema);