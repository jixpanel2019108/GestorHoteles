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

module.exports = {
    registrarUsuario
}