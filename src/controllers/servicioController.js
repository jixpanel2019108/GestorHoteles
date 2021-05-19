'use strict'
const Servicio = require('../models/servicioModel')

function agregarServicio(req,res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(400).send({mensaje:'Solo los administradores pueden agregar usuario'})
    let servicioModel = new Servicio()
    let params = req.body;

    servicioModel.servicio = params.servicio;
    servicioModel.descripcion = params.descripcion;
    servicioModel.precio = params.precio;
    servicioModel.hotel = params.hotel;

    if (params.servicio == '' || params.descripcion == '' || params.precio == '' || params.hotel == '' ){
        return res.status(500).send({mensaje:'No puede hacer la peticion con campos vacios'})
    }

    Servicio.findOne({servicio:servicioModel.servicio, descripcion: servicioModel.descripcion, precio: servicioModel.precio, hotel: servicioModel.hotel}
    ,(err, servicioEncontrado)=>{
        if (err) return res.status(500).send({mensaje:'Error al consultar el servicio'})
        if (servicioEncontrado) return res.status(500).send({mensaje:'El servicio ya existe en este hotel'})
        servicioModel.save((err, servicioGuardado)=>{
            if (err) return res.status(500).send({mensaje:'Error al guardar el servicio'})
            if (!servicioGuardado) return res.status(500).send({mensaje:'La peticion de servicio se envió vacia'})

            return res.status(200).send({servicioGuardado})
        })
    })
}

function obtenerServiciosHotel(req,res){
    let idHotel = req.params.idHotel

    Servicio.find({hotel:idHotel},(err, serviciosEncontrados)=>{
        if (err) return res.status(500).send({mensaje:'Error al hacer la peticion a la base de datos'})
        if (!serviciosEncontrados) return res.status(500).send({mensaje:'No se encontro ningun servicio en la base de datos'})

        return res.status(200).send({serviciosEncontrados})
    })
}

function eliminarServicio(req,res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(400).send({mensaje:'Solo los administradores pueden eliminar usuario'})
    let idServicio = req.params.idServicio;

    Servicio.findOneAndDelete({_id: idServicio},(err,servicioEliminado)=>{
        if (err) return res.status(500).send({mensaje:'Error al eliminar el servicio'})

        return res.status(200).send({mensaje:'El servicio se ha eliminado'})
    })
}

function actualizarServicio(req,res){
    if (req.user.rol != 'ROL_ADMIN') return res.status(400).send({mensaje:'Solo los administradores pueden eliminar usuario'})
    let idServicio = req.params.idServicio
    let params = req.body

    Servicio.findOneAndUpdate({_id: idServicio},{servicio:params.idServicio,descripcion: params.descripcion, precio: params.precio},
    { new: true, useFindAndModify: false }, (err,servicioActualizado)=>{
        if (err) return res.status(500).send({mensaje:'Error al actualizar el servicio'})
        
        return res.status(200).send({servicioActualizado})

    })
}

module.exports = {
    agregarServicio,
    obtenerServiciosHotel,
    eliminarServicio,
    actualizarServicio
}