'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'claveSecreta';

exports.createToken = function(usuario) {
    var payload = {
        sub: usuario._id,
        correo: usuario.correo,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        nacimiento: usuario.nacimiento,
        direccion: usuario.direccion,
        pais: usuario.pais,
        ciudad: usuario.ciudad,
        iat: moment.unix(),
        exp: moment().day(30, 'days').unix()
    }
    return jwt.encode(payload, secret);
}