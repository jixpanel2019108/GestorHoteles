'use strict'
const Evento = require('../models/eventoModel')

function registrarEvento(req, res) {
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Solo los administradores pueden registrar' })
    var eventoModel = new Evento();
    var idTipoEvento = req.params.idTipoEvento;
    var idHotel = req.params.idHotel;
    var params = req.body;

    eventoModel.evento = params.evento;
    eventoModel.fecha = params.fecha;
    eventoModel.tipoEvento = idTipoEvento;
    eventoModel.hotel = idHotel;

    if (params.evento == '' || params.fecha == '') return res.status(500).send({ mensaje: 'Debe rellenar todos los campos' })
    eventoModel.save((err, eventoGuardado) => {
        if (err) return res.status(500).send({ mensaje: 'Error al ejecutar la peticion' })
        if (!eventoGuardado) return res.status(500).send({ mensaje: 'Error al guardar el Evento' })

        return res.status(200).send({ eventoGuardado })
    })
}

module.exports = {
    registrarEvento
}