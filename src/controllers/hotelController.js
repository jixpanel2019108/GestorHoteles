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
    hotelModel.habitaciones = false
    hotelModel.imagen = params.imagen

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

function obtenerHoteles(req, res) {
    Hotel.find({}, (err, hotelesEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error al buscar los hoteles' })
        if (!hotelesEncontrados) return res.status(500).send({ mensaje: 'No existen hoteles' })

        return res.status(200).send({ hotelesEncontrados })
    }).distinct('pais')
}

function obtenerHotelesAll(req, res) {
    Hotel.find({}, (err, hotelesEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error al buscar los hoteles' })
        if (!hotelesEncontrados) return res.status(500).send({ mensaje: 'No existen hoteles' })

        return res.status(200).send({ hotelesEncontrados })
    })
}

function obtenerHotelesPais(req,res){
    let idPais = req.params.idPais
    Hotel.find({pais: idPais, habitaciones: true},(err,hotelesEncontrados)=>{
        if (err) return res.status(500).send({ mensaje: 'Error al buscar los hoteles' })
        if (!hotelesEncontrados) return res.status(500).send({ mensaje: 'No se encontró ningun hotel en el país' })
        
        return res.status(200).send({hotelesEncontrados})
    })
}

function obtenerHotelNombre(req,res){
    let params = req.body
    
    Hotel.findOne({nombre: params.nombre},(err, hotelObtenido) => {
        if (err) return res.status(500).send({ mensaje: 'Error al buscar el hotele' })
        if (!hotelObtenido) return res.status(500).send({ mensaje: 'No existen hoteles' })

        return res.status(200).send({hotelObtenido})
    })
}

function obtenerHotelId(req,res){
    let idHotel = req.params.idHotel

    Hotel.findOne({_id:idHotel}, (err, hotelEncontrado)=> {
        if (err) return res.status(500).send({ mensaje: 'Error al buscar el hotel' })
        if (!hotelEncontrado) return res.status(500).send({ mensaje: 'No existen hoteles' })

        return res.status(200).send({hotelEncontrado})
    })
}

function adminObtenerHoteles(req,res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Usted no es administrador' })
    Hotel.find({}, (err, hotelesEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error al buscar los hoteles' })

        return res.status(200).send({ hotelesEncontrados })
    })
}

function adminEditarHotel(req, res) {
    var idHotel = req.params.idHotel;
    var params = req.body

    if (req.user.rol != 'ROL_ADMIN') {
        return res.status(500).send({ mensaje: 'Solo el administrador puede editar.' })
    }

    Hotel.findByIdAndUpdate(idHotel, {nombre: params.nombre,pais: params.pais,ciudad: params.ciudad,direccion: params.direccion}, { new: true }, (err, hotelActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!hotelActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar Usuario' });

        return res.status(200).send({ hotelActualizado })
    })
}

function adminEliminarHotel(req, res) {
    const idHotel = req.params.idHotel;

    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Solo puede eliminar el Administrador' })
    Hotel.findByIdAndDelete(idHotel, (err, hotelEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de eliminar' })
        if (!hotelEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el hotel' })

        return res.status(200).send({ hotelEliminado });
    })
}

module.exports = {
    registrarHotel,
    obtenerHoteles,
    obtenerHotelesPais,
    obtenerHotelNombre,
    obtenerHotelesAll,
    obtenerHotelId,
    adminObtenerHoteles,
    adminEditarHotel,
    adminEliminarHotel
}