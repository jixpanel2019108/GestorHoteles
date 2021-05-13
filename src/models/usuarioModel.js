const mongoose = require("mongoose")
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    usuario: String,
    correo: String,
    password: String,
    rol: String,
    nombre: String,
    apellido: String,
    nacimiento: String,
    direccion: String,
    pais: String,
    ciudad: String,
    imagen: String,
    hotel: { type: Schema.Types.ObjectId, ref: 'hoteles' }
})

module.exports = mongoose.model('usuarios', UsuarioSchema);