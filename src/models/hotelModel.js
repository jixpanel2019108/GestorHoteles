'use strict'

const mongoose = require('mongoose')
var Schema = mongoose.Schema

var HotelSchema = Schema({
    nombre: String,
    pais: String,   
    ciudad: String,
    puntuacion: Number,
    direccion: String,
    contador: Number,
    habitaciones: Boolean,
    imagen: String
})

module.exports = mongoose.model('hoteles', HotelSchema);