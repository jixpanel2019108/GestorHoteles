'use strict'
const Reservacion = require('../models/reservacionModel')
const Habitacion = require('../models/habitacionModel')

function reservarHabitacion(req,res){
    let idHabitacion = req.params.idHabitacion
    let params = req.body

    if (params.nombrePersona == '' || params.apellidoPersona == '' || params.correoPersona == '' || params.telefonoPersona == '' ||
        params.nombreTarjeta == '' || params.numeroTarjeta == '' || params.exp == '' || params.cvv == '') {
        return res.status(500).send({ mensaje: 'Tiene que rellenar todos los campos' })
    }

    Habitacion.findById(idHabitacion, (err, habitacionEncontrada) => {
        if (err) return res.status(500).send({mensaje:'Error al buscar Habitaciones'})
        if (!habitacionEncontrada) return res.status(500).send({mensaje:'No se encontraron habitaciones'})

        Reservacion.findOneAndUpdate({usuario: req.user.sub},{
            idHabitacion: idHabitacion,
            precio: habitacionEncontrada.precio,
            nombrePersona: params.nombrePersona,
            apellidoPersona: params.apellidoPersona,
            correoPersona: params.correoPersona,
            telefonoPersona: params.telefonoPersona,
            nombreTarjeta: params.nombreTarjeta,
            numeroTarjeta: params.numeroTarjeta,
            exp: params.exp,
            cvv: params.cvv,
            fecha: new Date()},
            { new: true, useFindAndModify: false },(err, reservacionActualizada) => {
                if (err) return res.status(500).send({mensaje:'Error al actualizar la reservacion'})
                if (!reservacionActualizada) return res.status(500).send({mensaje: 'No se actualizó la reservación'})

                Habitacion.findByIdAndUpdate(idHabitacion,{ $push: { diasReservados: {checkIn: reservacionActualizada.checkIn, checkOut: reservacionActualizada.checkOut} } },
                { new: true, useFindAndModify: false }, (err, habitacionActualizada) => {
                    if (err) return res.status(500).send({mensaje:'Error al actualizar la habitacion'})
                    if (!habitacionActualizada) return res.status(500).send({mensaje: 'No se actualizó la habitacion'})  
                })

                return res.status(200).send({reservacionActualizada}) 
            } )
            //TODO: FALTA AGREGAR EL CHECKIN Y OUT A HABITACION CUANDO YA SE HAYA RESERVADO
    })
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
    reservarHabitacion,
    agregarChekInOut
}