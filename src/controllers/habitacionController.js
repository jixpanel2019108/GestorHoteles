'use strict'
const Habitacion = require('../models/habitacionModel');
const bcrypt = require('bcrypt-nodejs');

function registrarHabitacion(req, res) {
    var habitacionModel = new Habitacion();
    var params = req.body;
    var idHotel = req.params.idHotel;

    if (params.tipo == "" || params.nombre == "" || params.precio == "") {
        return res.status(500).send({ mensaje: 'Tiene que rellenar todos los campos' })
    }

    habitacionModel.tipo = params.tipo;
    habitacionModel.nombre = params.nombre;
    habitacionModel.precio = params.precio;
    habitacionModel.hotel = idHotel;

    Habitacion.findOne({ tipo: params.tipo, nombre: params.nombre, precio: params.precio, hotel: idHotel }, (err, habitacionEncontrada) => {
        if (habitacionEncontrada) return res.status(500).send({ mensaje: 'Esta habitacion ya existe' });

        habitacionModel.save((err, habitacionGuardada) => {
            if (err) return res.status(500).send({ mensaje: 'Error al guardar la habitacion' })

            return res.status(200).send({ habitacionGuardada })
        })
    })

}

function obtenerHabitaciones(req, res) {
    Habitacion.find({}, (err, habitacionesEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'Error al obtener habitaciones' })
        if (!habitacionesEncontradas) return res.status(500).send({ mensaje: 'No existen habitaciones' })

        return res.status(200).send({ habitacionesEncontradas })
    })
}

function obtenerHabitacionesPorHotel(req, res) {
    var idHotel = req.params.idHotel

    Habitacion.find({ hotel: idHotel }, (err, habitacionesEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'Error al buscar las habitaciones' })
        if (!habitacionesEncontradas) return res.status(200).send({ mensaje: 'Este hotel aun no tiene habitaciones' })

        return res.status(200).send({ habitacionesEncontradas })
    })
}

module.exports = {
    registrarHabitacion,
    obtenerHabitaciones,
    obtenerHabitacionesPorHotel
}