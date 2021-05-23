'use strict'
const Reservacion = require('../models/reservacionModel')
const Habitacion = require('../models/habitacionModel')

function reservar(req,res){

}

function agregarChekInOut(req,res){
    let reservacionModel = new Reservacion()
    let params = req.body
    let idUsuario = req.params.idUsuario

    Reservacion.findOneAndUpdate({usuario:idUsuario},{checkIn: params.checkIn, checkOut: params.checkOut},
    { new: true, useFindAndModify: false },(err,reservacionActualizada) => {
        if (err) return res.status(500).send({mensaje:'Error al actualizar reservacion'})
        if (!reservacionActualizada) return res.status(500).send({mensaje:'No se actualizó'})

        
        return res.status(200).send({reservacionActualizada})
    })
}

function crearReservacion(req,res){

}

function vaciarReservacion(idUsuario){

}

module.exports = {
    reservar,
    agregarChekInOut
}