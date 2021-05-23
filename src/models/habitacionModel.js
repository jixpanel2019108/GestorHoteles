const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var HabitacionSchema = Schema({
    tipo: String,
    nombre: String,
    precio: String,
    estado: Boolean,
    diasReservados: [{checkIn: Number,
            checkOut: Number}],
    hotel: { type: Schema.Types.ObjectId, ref: 'hoteles' }
})

module.exports = mongoose.model('habitaciones', HabitacionSchema)