'use strict'
const mongoose = require('mongoose')
var Schema = mongoose.Schema

var EventosSchema = Schema({
    evento: String,
    fecha: Date,
    tipoEvento: { type: Schema.Types.ObjectId, ref: 'tipoEventos' },
    hotel: { type: Schema.Types.ObjectId, ref: 'hoteles' },
})

module.exports = mongoose.model('eventos', EventosSchema)