const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var HabitacionSchema = Schema({
    tipo: String,
    nombre: String,
    precio: Number,
    estado: String,
    hotel: { type: Schema.Types.ObjectId, ref: 'hoteles' }
})

module.exports = mongoose.model('holaaaas', HabitacionSchema)