'use strict'

const Hotel = require('../models/hotelModel')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt')

function registrarHotel(req, res) {
    var hotelModel = new Hotel();
    var params = req.body;

    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Solo el administrador posee estos permisos' })
    if (params.nombre && params.pais && params.puntuacion && params.direccion) {
        hotelModel.nombre = params.nombre;
        hotelModel.pais = params.pais;
        hotelModel.puntuacion = params.puntuacion;
        hotelModel.direccion = params.direccion;
        hotelModel.save((err, hotelGuardado) => {
            if (err) return res.status(500).send({ mensaje: 'Error al guardar hotel' })
            if (!hotelGuardado) return res.status(500).send({ mensaje: 'No se ha podido registrar Hotel' })

            return res.status(200).send(hotelGuardado)
        })
    }
}

module.exports = {
    registrarHotel
}