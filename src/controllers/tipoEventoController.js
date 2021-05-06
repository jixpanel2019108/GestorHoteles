'use strict'
const TipoEvento = require('../models/tipoEventoModel')
const Evento = require('../models/eventoModel')

function registrarTipoEvento(req, res) {
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Solo los administradores tienen permisos' })

    var tipoEventoModel = new TipoEvento();
    var params = req.body;
    tipoEventoModel.tipo = params.tipo;

    TipoEvento.findOne({ tipo: params.tipo }, (err, tipoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error al consultar los Tipo de Evento' })
        if (tipoEncontrado) return res.status(500).send({ mensaje: 'Ya existe este tipo de evento' })

        tipoEventoModel.save((err, tipoEventoGuardado) => {
            if (err) return res.status(500).send({ mensaje: 'Error al consultar los Tipo de Evento' })
            if (!tipoEventoGuardado) return res.status(500).send({ mensaje: 'No se ha podido guardar el Evento' })

            return res.status(200).send({ tipoEventoGuardado })
        })
    })
}

function obtenerTipoEventos(req, res) {
    TipoEvento.find({}, (err, tiposEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error al buscar los tipos de evento' })
        if (!tiposEncontrados) return res.status(500).send({ mensaje: 'No existen tipos de evento' })

        return res.status(200).send({ tiposEncontrados })
    })
}

function obtenerTipoEventosPorId(req, res) {
    //Para ver que categoria es el evento
    var idEvento = req.params.idEvento
    Evento.findOne({ _id: idEvento }, (err, eventoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error al hacer la consulta' })
        if (!eventoEncontrado) return res.status(500).send({ mensaje: 'No se ha encontrado ningun evento' })
        TipoEvento.findOne({ _id: eventoEncontrado.tipoEvento }, (err, tiposEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error al buscar los tipos de evento' })
            if (!tiposEncontrados) return res.status(500).send({ mensaje: 'No existen tipos de evento' })

            return res.status(200).send({ tiposEncontrados })
        })
    })
}

function editarTipoEventos(req, res) {
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Solo los administradores tienen permisos' })
    var idTipoEvento = req.params.idTipoEvento;
    var params = req.body;

    TipoEvento.findByIdAndUpdate(idTipoEvento, { tipo: params.tipo }, { new: true, useFindAndModify: false }, (err, tipoEventoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error al actualizar el tipo evento' })
        if (!tipoEventoActualizado) return res.status(500).send({ mensaje: 'No se pudo actualizar' })

        return res.status(200).send({ tipoEventoActualizado })
    })
}

function eliminarTipoEvento(req, res) {
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Solo los administradores tienen permisos' })
    var idTipoEvento = req.params.idTipoEvento;

    TipoEvento.findByIdAndRemove(idTipoEvento, (err, tipoEventoEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error al eliminar el tipo de evento' })
        if (!tipoEventoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar tipo de evento' })

        return res.status(200).send({ mensaje: 'Se ha eliminado el tipo de evento' })
    })
}


module.exports = {
    registrarTipoEvento,
    obtenerTipoEventos,
    obtenerTipoEventosPorId,
    editarTipoEventos,
    eliminarTipoEvento
}