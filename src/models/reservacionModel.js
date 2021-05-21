'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ReservacionSchema = Schema({
    idHabitacion: {type: Schema.ObjectId, ref: 'habitaciones'},
    checkIn: Date,
    checkOut: Date,
    precio: Number,
    noches: Number,
    servicios:[{
        nombre: String,
        cantidad: Number,
        idServicio: {type: Schema.ObjectId, ref: 'servicios'}
    }],
    usuario:{type: Schema.Types.ObjectId, ref:'usuarios'},
    nombrePersona:String,
    apellidoPersona: String,
    correoPersona: String,
    telefonoPersona: String,
    nombreTarjeta:String,
    numeroTarjetoa:String,
    exp: String,
    cvv: String,
    fecha: Date,
    total: Number
})

module.exports = mongoose.model('reservaciones', ReservacionSchema)