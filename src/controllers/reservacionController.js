'use strict'
const Reservacion = require('../models/reservacionModel')
const Habitacion = require('../models/habitacionModel')
const Servicio = require('../models/servicioModel')
const Factura = require('../models/facturaModel')
const Hotel = require('../models/hotelModel')
var moment = require('moment'); 

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
    let fecha1 = moment(params.checkIn)
    let fecha2 = moment(params.checkOut)

    let noches = fecha2.diff(fecha1, 'days');
    

    Reservacion.findOneAndUpdate({usuario:idUsuario},{checkIn: params.checkIn, checkOut: params.checkOut, noches:noches},
    { new: true, useFindAndModify: false },(err,reservacionActualizada) => {
        if (err) return res.status(500).send({mensaje:'Error al actualizar reservacion'})
        if (!reservacionActualizada) return res.status(500).send({mensaje:'No se actualizó'})
        
        return res.status(200).send({reservacionActualizada})
    })
}

function agregarServiciosReservacion(req,res){
    let idServicio = req.params.idServicio
    let idUsuario = req.user.sub

    Servicio.findById(idServicio, (err, servicioEncontrado)=> {
        
        if (err) return res.status(500).send({mensaje:'Error al hacer la peticion a servicios'})
        if (!servicioEncontrado) return res.status(500).send({mensaje:'No se encontro Servicios'})
        console.log(idServicio) 

    Reservacion.findOne({usuario:idUsuario, "servicios.idServicio": idServicio},(err, reservacionEncontrada) =>{
        if (err) return res.status(500).send({mensaje:'Error al hacer la peticion a reservacion'})
        if (!reservacionEncontrada){
        Reservacion.findOneAndUpdate({usuario: idUsuario}, 
        {$push:{servicios:{nombre: servicioEncontrado.servicio,precio:servicioEncontrado.precio, idServicio:servicioEncontrado._id }}},
        {new:true, useFindAndModify: false},(err, servicioAgregadoReservacion)=>{
            return res.status(200).send({servicioAgregadoReservacion})
        })//Reservacion.findOneAndUpdate
        }else{
            return res.status(500).send({mensaje:'El servicio ya fue agregado'})
        }//!reservacionEncontrada
    })//Reservacion.findOne
    })//Servicio.findOne
}

function obtenerServiciosReservacion(req,res){
    let idUsuario = req.user.sub

    Reservacion.findOne({usuario:idUsuario},(err, reservacionEncontrada) => {
        if (err) return res.status(500).send({mensaje:'Error al hacer la peticion a reservacion'})
        if (!reservacionEncontrada) return res.status(500).send({mensaje:'Aun no hay servicios'})

        return res.status(200).send({reservacionEncontrada})
    })
}

function eliminarServicioReservacion(req,res){
    let idUsuario = req.user.sub
    let idServicio = req.params.idServicio
    
    Reservacion.findOneAndUpdate({usuario: idUsuario, "servicios.idServicio": idServicio}, 
    {$pull:{"servicios":{"idServicio":idServicio}}},
    {new:true, useFindAndModify: false},(err, servicioRemovido)=>{
            return res.status(200).send({servicioRemovido})
    })
        
}

function actualizarTotal(req,res){
    let idUsuario = req.user.sub
    let sumaServicio = 0
    let totalReservacion

    Reservacion.findOne({usuario:idUsuario},(err, reservacionEncontrada)=> {
        if (err) return res.status(500).send({mensaje:'Error al hacer la peticion a reservacion'})
        if (!reservacionEncontrada) return res.status(500).send({mensaje:'No se encontro la reservación'})

        console.log(reservacionEncontrada.servicios);

        reservacionEncontrada.servicios.forEach(function callback(currentValue, index, array) {
            sumaServicio = sumaServicio+currentValue.precio
        });

        totalReservacion = sumaServicio+(reservacionEncontrada.precio*reservacionEncontrada.noches)
        console.log(reservacionEncontrada.precio);
        Reservacion.findOneAndUpdate({usuario: idUsuario}, 
        {$set:{"total":totalReservacion}},
        {new:true, useFindAndModify: false},(err, reservacionTotalActualizada)=>{
            if (err) return res.status(500).send({mensaje:'Error al hacer la peticion a reservacion'})
            if (!reservacionTotalActualizada) return res.status(500).send({mensaje:'No se encontro la reservación'})

            return res.status(200).send({reservacionTotalActualizada})
        })

    })
    
}

function agregarPrecio(req,res){
    let idUsuario = req.user.sub
    let idHabitacion = req.params.idHabitacion

    Habitacion.findOne({_id: idHabitacion},(err, habitacionEncontrada)=> {
        if (err) return res.status(500).send({mensaje:'Error hacer la peticion a Resevacion'})
        if (!habitacionEncontrada) return res.status(500).send({mensaje:'No se encontró'})

        Reservacion.findOneAndUpdate({usuario:idUsuario},{precio: habitacionEncontrada.precio},
            { new: true, useFindAndModify: false },(err,reservacionActualizada) => {
                if (err) return res.status(500).send({mensaje:'Error al actualizar reservacion'})
                if (!reservacionActualizada) return res.status(500).send({mensaje:'No se actualizó'})
                
                return res.status(200).send({reservacionActualizada})
            })
    })
}

function agregarFactura(req,res){
    let idUsuario = req.user.sub 
    let facturaModel = new Factura()

    Reservacion.findOne({usuario:idUsuario},(err, reservacionEncontrada)=> {
        if (err) res.status(500).send({mensaje: 'Error al hacer la peticion'})
        if (!reservacionEncontrada) res.status(500).send({mensaje: 'Reservacion no encontrada'})


            facturaModel.idHabitacion = reservacionEncontrada.idHabitacion,
            facturaModel.servicios = reservacionEncontrada.servicios,
            facturaModel.checkIn = reservacionEncontrada.checkIn,
            facturaModel.checkOut = reservacionEncontrada.checkOut,
            facturaModel.precio = reservacionEncontrada.precio,
            facturaModel.noches = reservacionEncontrada.noches,
            facturaModel.usuario = reservacionEncontrada.usuario,
            facturaModel.nombrePersona = reservacionEncontrada.nombrePersona,
            facturaModel.apellidoPersona = reservacionEncontrada.apellidoPersona,
            facturaModel.correoPersona = reservacionEncontrada.correoPersona,
            facturaModel.telefonoPersona = reservacionEncontrada.telefonoPersona,
            facturaModel.nombreTarjeta = reservacionEncontrada.nombreTarjeta,
            facturaModel.exp = reservacionEncontrada.exp,
            facturaModel.cvv = reservacionEncontrada.cvv,
            facturaModel.fecha = reservacionEncontrada.fecha,
            facturaModel.total = reservacionEncontrada.total

        facturaModel.save((err, facturaGuardada )=> { 
            if (err) res.status(500).send({mensaje: 'Error al hacer la peticion'})
            if (!facturaGuardada) res.status(500).send({mensaje: 'Factura no se agregó'})

            Reservacion.findOneAndUpdate({usuario:idUsuario},
                {$set:{checkIn : new Date(),
                checkOut : new Date(),
                precio : 0,
                noches : 0,
                servicios: [],
                usuario : idUsuario,
                nombrePersona : '',
                apellidoPersona :  '',
                correoPersona :  '',
                telefonoPersona :  '',
                nombreTarjeta : '',
                numeroTarjetoa : '',
                exp :  '',
                cvv :  '',
                fecha :  new Date(),
                total :  0}},
                {new:true, useFindAndModify: false},(err, reservacionActualizada)=> {
                    if (err) res.status(500).send({mensaje: 'Error al hacer la peticion'})
                    if (!reservacionActualizada) res.status(500).send({mensaje: 'Reservacion Actualizada'})
            })
            return res.status(200).send({facturaGuardada})
        })
    })
}

function obtenerFacturasUsuario(req,res){
    let idUsuario = req.user.sub

    Factura.find({usuario: idUsuario}).populate('idHabitacion','nombre hotel, _id').exec((err, facturasEncontradas) => {
        if (err) res.status(500).send({mensaje:'Error en la peticion de facturas'})
        if (!facturasEncontradas) res.status(500).send({mensaje:'No se encontraron factuas'})
        
        return res.status(200).send({facturasEncontradas})
    })
}



function obtenerServiciosFactura(req,res){
    let idUsuario = req.user.sub

    Factura.findOne({usuario:idUsuario},(err, facturaServicio) => {
        if (err) return res.status(500).send({mensaje:'Error al hacer la peticion a reservacion'})
        if (!facturaServicio) return res.status(500).send({mensaje:'Aun no hay servicios'})

        return res.status(200).send({facturaServicio})
    })
}

function obtenerHotelHabitacion(req,res){
    let idHabitacion = req.params.idHabitacion
    Habitacion.findOne({_id: idHabitacion},(err,habitacionEncontrada)=>{
        if (err) return res.status(500).send({mensaje:'Error al hacer la peticion a reservacion'})
        if (!habitacionEncontrada) return res.status(500).send({mensaje:'Aun no hay habitaciones'})
        Hotel.findOne({_id: habitacionEncontrada.hotel},(err, hotelEncontrado)=>{
            if (err) return res.status(500).send({mensaje:'Error al hacer la peticion a reservacion'})
            if (!hotelEncontrado) return res.status(500).send({mensaje:'Error al traer Hoteles'})

            return res.status(200).send({hotelEncontrado})
        })
    })
}

module.exports = {
    reservarHabitacion,
    agregarChekInOut,
    agregarServiciosReservacion,
    obtenerServiciosReservacion,
    eliminarServicioReservacion,
    actualizarTotal,
    agregarPrecio,
    agregarFactura,
    obtenerFacturasUsuario,
    obtenerServiciosFactura,
    obtenerHotelHabitacion
}