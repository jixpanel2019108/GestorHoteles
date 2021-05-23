'use strict'
const Habitacion = require('../models/habitacionModel');
const Hotel = require('../models/hotelModel');
const Reservacion = require ('../models/reservacionModel')
const bcrypt = require('bcrypt-nodejs');

function registrarHabitacion(req, res) {
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Solo los administradores pueden registrar' })
    var habitacionModel = new Habitacion();
    var params = req.body;

    if (params.tipo == "" || params.nombre == "" || params.precio == "") {
        return res.status(500).send({ mensaje: 'Tiene que rellenar todos los campos' })
    }

    habitacionModel.tipo = params.tipo;
    habitacionModel.nombre = params.nombre;
    habitacionModel.precio = params.precio;
    habitacionModel.hotel = params.hotel;
    habitacionModel.estado = true;
    habitacionModel.diasReservados = [{checkIn: 0,checkOut: 0}],

    Habitacion.findOne({ tipo: params.tipo, nombre: params.nombre, precio: params.precio, hotel: params.hotel }, (err, habitacionEncontrada) => {
        if (habitacionEncontrada) return res.status(500).send({ mensaje: 'Esta habitacion ya existe' });

        habitacionModel.save((err, habitacionGuardada) => {
            if (err) return res.status(500).send({ mensaje: 'Error al guardar la habitacion' })

            if(habitacionGuardada){
                //ESTA FUNCION SE AGREGA CUANDO SE VERIFICA QUE SI HAY HABITACIONES DISPONIBLES
                Hotel.findByIdAndUpdate(habitacionGuardada.hotel,{habitaciones: true},(err, hotelActualizado)=>{
                    if (err) return res.status(200).send({mensaje:'Error al cambiar el status de Habitacioens'})
                    if (!hotelActualizado) return res.status(200).send({mensaje:'No se pudo actualizar el Hotel'})
                })
              return res.status(200).send({ habitacionGuardada })  
            }else{
                return res.status(500).send({mensaje: 'La peticion venía vacía'})
            }
            
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
    // if (req.user.rol != 'ROL_USUARIO') return res.status(500).send({ mensaje: 'esta funcion es para usuario' })
    var idHotel = req.params.idHotel

    // setear
    // setDisponibleHabitaciones(idHotel);
    //verificar disponibilidad y cambiar

    Habitacion.find({ hotel: idHotel }, (err, habitacionesEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'Error al buscar las habitaciones' })
        if (!habitacionesEncontradas) return res.status(200).send({ mensaje: 'Este hotel no tiene habitaciones Disponibles' })

        habitacionesEncontradas.forEach( function callback(elemento,index) {
            Habitacion.findByIdAndUpdate(elemento._id,{estado:true},{ new: true, useFindAndModify: false },(err, habitacionActualizada)=>{
                if (err) return res.status(500).send({ mensaje: 'No funciono el forEach' })
                if (!habitacionActualizada) return res.status(500).send({mensaje:'habitacionActualizada Vacio'})
            })
        })

        Reservacion.findOne({usuario:req.user.sub},(err, reservacionEncontrada)=>{
            if(err) return res.status(500).send({mensaje:'Error al buscar reservacion en Habitaciones'})

            habitacionesEncontradas.forEach(function callback(habitacion){
                habitacion.diasReservados.forEach(function callback(diasReservados){
                    console.log(reservacionEncontrada.checkOut);
                    console.log(reservacionEncontrada.checkOut.getTime());
                    if (diasReservados.checkIn == 0 && diasReservados.checkOut == 0){
                        console.log('Disponibilidad True');

                    }else if(reservacionEncontrada.checkIn.getTime() >= diasReservados.checkIn && reservacionEncontrada.checkIn.getTime() < diasReservados.checkOut){
                        console.log('Disponibilidad Falsa');
                        Habitacion.findOneAndUpdate({_id: habitacion._id},{estado:false},{ new: true, useFindAndModify: false },(err,habitacionActualizada)=>{
                            if (err) return res.status(500).send({ mensaje: 'No funciono el forEach' })
                            if (!habitacionActualizada) return res.status(500).send({mensaje:'habitacionActualizada Vacio'})
                        })

                    }else if(reservacionEncontrada.checkOut.getTime() > diasReservados.checkIn && reservacionEncontrada.checkOut.getTime() < diasReservados.checkOut){
                        console.log('Disponibilidad Falsa');
                        Habitacion.findOneAndUpdate({_id: habitacion._id},{estado:false},{ new: true, useFindAndModify: false },(err,habitacionActualizada)=>{
                            if (err) return res.status(500).send({ mensaje: 'No funciono el forEach' })
                            if (!habitacionActualizada) return res.status(500).send({mensaje:'habitacionActualizada Vacio'})
                        })
                        
                    }else{
                        console.log('Disponibilidad true');
                    }
                })
            })
        })

        Habitacion.find({ hotel: idHotel, estado: true },(err,habitacionesEncontradas2)=>{
            if (err) return res.status(500).send({ mensaje: 'Error al buscar las habitaciones' })
            if (!habitacionesEncontradas) return res.status(200).send({ mensaje: 'Este hotel no tiene habitaciones Disponibles' })

            console.log(habitacionesEncontradas2);
            return res.status(200).send({ habitacionesEncontradas2 })
        })

    })
}



//TODO: VERIFICACION DE HABITACIONES

module.exports = {
    registrarHabitacion,
    obtenerHabitaciones,
    obtenerHabitacionesPorHotel
}