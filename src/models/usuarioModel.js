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
    ciudad: String
})

module.exports = mongoose.model('usuarios', UsuarioSchema);