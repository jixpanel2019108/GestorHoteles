'use strict'
const Usuario = require('../models/usuarioModel');
const Reservacion = require('../models/reservacionModel')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const reservacionModel = require('../models/reservacionModel');

function registrarUsuario(req, res) {
    var usuarioModel = new Usuario();
    var params = req.body;

    if (params.usuario && params.correo && params.password && params.nombre && params.apellido &&
        params.nacimiento && params.direccion && params.pais && params.ciudad) {
        usuarioModel.usuario = params.usuario;
        usuarioModel.correo = params.correo;
        usuarioModel.rol = 'ROL_USUARIO';
        usuarioModel.nombre = params.nombre;
        usuarioModel.apellido = params.apellido;
        usuarioModel.nacimiento = params.nacimiento;
        usuarioModel.direccion = params.direccion;
        usuarioModel.telefono = params.telefono;
        usuarioModel.pais = params.pais;
        usuarioModel.ciudad = params.ciudad;

        Usuario.findOne({ usuario: params.usuario }, (err, usuarioUsuario) => {
            if (err) return res.status(500).send({ mensaje: 'Error al verificar usuario' })
            if (usuarioUsuario) {
                return res.status(500).send({ mensaje: 'El nombre de usuario ya esta en uso, utilice otro' })
            }
            Usuario.findOne({ correo: params.correo }, (err, usuarioCorreo) => {
                if (err) return res.status(500).send({ mensaje: 'Error al verificar correo' })
                if (usuarioCorreo) {
                    return res.status(500).send({ mensaje: 'El correo ya tiene una cuenta registrada' })
                } else {
                    bcrypt.hash(params.password, null, null, (err, passEncriptada) => {
                        usuarioModel.password = passEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500).send({ mensaje: 'Error al guardar usuario' })

                            if (usuarioGuardado) {
                                crearReservacion(usuarioGuardado._id)
                                res.status(200).send(usuarioGuardado)
                            } else {
                                res.status(500).send({ mensaje: 'No se ha podido registrar el usuario' })
                            }
                        })
                    })
                }
            })
        })
    }
}

function crearReservacion(idUsuario){
    let reservacionModel = new Reservacion()
    // reservacionModel.idHabitacion = ''
    reservacionModel.checkIn = new Date()
    reservacionModel.checkOut = new Date()
    reservacionModel.precio = 0
    reservacionModel.noches = 0
    reservacionModel.servicios= [],
    reservacionModel.usuario = idUsuario
    reservacionModel.nombrePersona = ''
    reservacionModel.apellidoPersona =  ''
    reservacionModel.correoPersona =  ''
    reservacionModel.telefonoPersona =  ''
    reservacionModel.nombreTarjeta = ''
    reservacionModel.numeroTarjetoa = ''
    reservacionModel.exp =  ''
    reservacionModel.cvv =  ''
    reservacionModel.fecha =  new Date()
    reservacionModel.total =  0

    reservacionModel.save()
}

function login(req, res) {
    var params = req.body;
    Usuario.findOne({ usuario: params.usuario }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de usuario Usuario' });
        if (usuarioEncontrado) {
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passCorrecta) => {
                if (passCorrecta) {
                    if (params.obtenerToken === 'true') {
                        return res.status(200).send({ token: jwt.createToken(usuarioEncontrado) });
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuarioEncontrado })
                    }
                } else {
                    return res.status(401).send({ mensaje: 'El usuario no se ha podido identificar' })
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'Error al obtener usuario' });
        }
    })
}

function editarUsuario(req, res) {
    var params = req.body
    delete params.password

    if (params.usuario == '' || params.nombre == '' || params.apellido == '' || params.nacimiento == '' ||
        params.direccion == '' || params.pais == '' || params.ciudad == '') {
        return res.status(500).send({ mensaje: 'Tiene que rellenar todos los campos' })
    }
    Usuario.findOneAndUpdate({ _id: req.user.sub }, {
        usuario: params.usuario,
        nombre: params.nombre,
        apellido: params.apellido,
        nacimiento: params.nacimiento,
        direccion: params.direccion,
        pais: params.pais,
        ciudad: params.ciudad,
    }, { new: true, useFindAndModify: false }, (err, usuarioActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error al actualizar usuario' })
        return res.status(500).send({ usuarioActualizado })
    })
}

function eliminarUsuario(req, res) {
    Usuario.findOneAndDelete({ _id: req.user.sub }, (err, usuarioEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error al eliminar el usuario' })
        return res.status(200).send({ mensaje: 'Su usuario ha sido eliminado con exito' })
    })
}

function obtenerUsuarios(req, res) {
    // if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Usted no es administrador' })
    Usuario.find({}, (err, usuariosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error al buscar los usuarios' })

        return res.status(200).send({ usuariosEncontrados })
    })
}

function registrarAdminHotel(req, res) {
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Solo los administradores pueden registrar a admin hotel' })
    var usuarioModel = new Usuario();
    var params = req.body;
    var idHotel = req.params.idHotel

    if (params.usuario == '' || params.correo == '' || params.password == '') {
        return res.status(500).send({ mensaje: 'Tiene que rellenar todos los campos' })
    }
    usuarioModel.usuario = params.usuario;
    usuarioModel.correo = params.correo;
    usuarioModel.rol = 'ROL_ADMIN_HOTEL'
    usuarioModel.hotel = idHotel;
    //TODO: hacer una busqueda para el hotel, para buscar el nombre asi agregarselo al nombre de usuario
    Usuario.findOne({ usuario: params.usuario }, (err, usuarioUsuario) => {
        if (err) return res.status(500).send({ mensaje: 'Error al consultar en la base de datos' })
        if (usuarioUsuario) return res.status(500).send({ mensaje: 'El usuario ya esta en uso' })
        Usuario.findOne({ correo: params.correo }, (err, usuarioCorreo) => {
            if (err) return res.status(500).send({ mensaje: 'Error al consultar en la base de datos' })
            if (usuarioCorreo) return res.status(500).send({ mensaje: 'El correo ya esta en uso' })

            bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;

                usuarioModel.save((err, usuarioGuardado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error al guardar' })

                    if (!usuarioGuardado) return res.status(500).send({ mensaje: 'No se ha podido registrar el usuario' })

                    return res.status(200).send({ usuarioGuardado })
                })
            })
        })
    })

}



module.exports = {
    registrarUsuario,
    editarUsuario,
    login,
    eliminarUsuario,
    obtenerUsuarios,
    registrarAdminHotel
}