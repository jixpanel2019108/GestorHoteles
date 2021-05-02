'use strict'
const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')

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
        usuarioModel.pais = params.pais;
        usuarioModel.ciudad = params.ciudad;

        Usuario.find({ $or: [{ usuario: usuarioModel.usuario }, { correo: usuarioModel.correo }] })
            .exec((err, usuariosEncontrados) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion de usuario' })

                if (usuariosEncontrados && usuariosEncontrados.length >= 1) {
                    return res.status(500).send({ mensaje: 'El usuario ya existe' })
                } else {
                    bcrypt.hash(params.password, null, null, (err, passEncriptada) => {
                        usuarioModel.password = passEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500).send({ mensaje: 'Error al guardar usuario' })

                            if (usuarioGuardado) {
                                res.status(200).send(usuarioGuardado)
                            } else {
                                res.status(500).send({ mensaje: 'No se ha podido registrar el usuario' })
                            }
                        })
                    })
                }
            })
    }
}

function login(req, res) {
    var params = req.body;
    Usuario.findOne({ correo: params.correo }, (err, usuarioEncontrado) => {
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

    if (req.user.rol != 'ROL_USUARIO') return res.status(500).send({ mensaje: 'Esta es una funcion para usuarios' })
    Usuario.findOne({ _id: req.user.sub }, (err, usuarioEncontrado) => {
        console.log(usuarioEncontrado);
        if (err) return res.status(500).send({ mensaje: 'Error al buscar el usuario logeado' })
        if (params.usuario == '' || params.nombre == '' || params.apellido == '' || params.nacimiento == '' ||
            params.direccion == '' || params.pais == '' || params.ciudad == '') {
            return res.status(500).send({ mensaje: 'Tiene que rellenar todos los campos' })
        }
        Usuario.findOneAndUpdate({ _id: usuarioEncontrado._id }, {
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
    })
}


module.exports = {
    registrarUsuario,
    editarUsuario,
    login
}