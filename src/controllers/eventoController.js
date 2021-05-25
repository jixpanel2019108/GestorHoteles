'use strict'
const Evento = require('../models/eventoModel')

function registrarEvento(req, res) {
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Solo los administradores pueden registrar' })
    var eventoModel = new Evento();
    var params = req.body;

    eventoModel.evento = params.evento;
    eventoModel.fecha = params.fecha;
    eventoModel.tipoEvento = params.tipoEvento;
    eventoModel.hotel = params.hotel;

    if (params.evento == '' || params.fecha == '') return res.status(500).send({ mensaje: 'Debe rellenar todos los campos' })
    eventoModel.save((err, eventoGuardado) => {
        if (err) return res.status(500).send({ mensaje: 'Error al ejecutar la peticion' })
        if (!eventoGuardado) return res.status(500).send({ mensaje: 'Error al guardar el Evento' })

        return res.status(200).send({ eventoGuardado })
    })
}

function obtenerEventosHotel(req, res) {
    //Para cuando el usuario entre a los eventos por hotel
    var idHotel = req.params.idHotel

    Evento.find({ hotel: idHotel }, (err, eventosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error al hacer la consulta' })
        if (!eventoEncontrado) return res.status(500).send({ mensaje: 'No se ha encontrado ningun evento' })

        return res.status(200).send({ eventosEncontrados })
    })
}

function obtenerEventosCategorias(req, res) {
    //Para que el usuario en la pagina de eventos por hotel pueda filtrar por categorias
    var idHotel = req.params.idHotel;
    var idTipo = req.params.idTipo;

    Evento.find({ hotel: idHotel, tipo: idTipo }, (err, eventosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error al hacer la consulta' })
        if (!eventoEncontrado) return res.status(500).send({ mensaje: 'No se ha encontrado ningun evento' })

        return res.status(200).send({ eventosEncontrados })
    })
}

function obtenerEventosIdHotel(req,res){
    let idHotel = req.params.idHotel

    Evento.find({hotel: idHotel},(err, eventosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error al hacer la consulta' })
        if (!eventosEncontrados) return res.status(500).send({ mensaje: 'No se ha encontrado ningun evento' })

        return res.status(200).send({eventosEncontrados})
    })
}

module.exports = {
    registrarEvento,
    obtenerEventosHotel,
    obtenerEventosCategorias,
    obtenerEventosIdHotel
}