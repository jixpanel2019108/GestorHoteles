'use strict'
const mongoose = require('mongoose') 
const Schema = mongoose.Schema

var ServicioSchema = Schema({
    servicio: String,
    descripcion: String,
    precio: Number,
    imagen: String,
    hotel: { type: Schema.Types.ObjectId, ref: 'hoteles' }
})

module.exports = mongoose.model('servicios',ServicioSchema) 