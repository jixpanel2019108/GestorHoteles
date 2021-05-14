'use strict'

const Hotel = require('../models/hotelModel')
const Usuario = require('../models/usuarioModel')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt')

function registrarHotel(req, res) {
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Solo el administrador posee estos permisos' })

    var hotelModel = new Hotel();
    var usuarioModel = new Usuario();
    var params = req.body;
    var idHotel = req.params.idHotel

    // if (params.nombre == '' || params.pais == '' || params.ciudad == '' || params.direccion==''  ) return res.status(500).send({ mensaje: 'Tiene que rellenar todos los campos Hotel' })
    // if (params.usuario == '' || params.correo == '' || params.password == '') return res.status(500).send({ mensaje: 'Tiene que rellenar todos los campos Ciudad' })


    hotelModel.nombre = params.nombre;
    hotelModel.pais = params.pais;
    hotelModel.ciudad = params.ciudad;
    hotelModel.direccion = params.direccion;

    usuarioModel.usuario = params.usuario;
    usuarioModel.correo = params.correo;
    usuarioModel.rol = 'ROL_ADMIN_HOTEL'
    
    hotelModel.save((err, hotelGuardado) => {
        if (err) return res.status(500).send({ mensaje: 'Error al guardar hotel' })
        if (!hotelGuardado) return res.status(500).send({ mensaje: 'No se ha podido registrar Hotel' })
        
        Usuario.findOne({ usuario: usuarioModel.usuario }, (err, usuarioUsuario) => {
            if (err) return res.status(500).send({ mensaje: 'Error al consultar en la base de datos' })
            if (usuarioUsuario) return res.status(500).send({ mensaje: 'El usuario ya esta en uso' })
            Usuario.findOne({ correo: usuarioModel.correo }, (err, usuarioCorreo) => {
                if (err) return res.status(500).send({ mensaje: 'Error al consultar en la base de datos' })
                if (usuarioCorreo) return res.status(500).send({ mensaje: 'El correo ya esta en uso' })
                usuarioModel.hotel = hotelGuardado._id;
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;
    
                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error al guardar Usuario' })
                        if (!usuarioGuardado) return res.status(500).send({ mensaje: 'No se ha podido registrar el usuario' })
    
                        return res.status(200).send({hotelGuardado,usuarioGuardado})
    
                        
                    })
                })
            })
        })
    
    })
}


module.exports = {
    registrarHotel
}