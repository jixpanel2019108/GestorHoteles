'use strict'
const TipoEvento = require('../models/tipoEventoModel')

function registrarTipoEvento(req, res) {
    var tipoEventoModel = new TipoEvento();
    var params = req.body;
    tipoEventoModel.tipo = params.tipo;

    if (req.user.rol != 'ROL_ADMIN' && req.user.rol != 'ROL_ADMIN_HOTEL') return res.status(500).send({ mensaje: 'Solo los administradores tienen permisos' })
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

function editarTipoEventos(req, res) {
    var idTipoEvento = req.params.idTipoEvento;
    var params = req.body;

    if (req.user.rol != 'ROL_ADMIN' && req.user.rol != 'ROL_ADMIN_HOTEL') return res.status(500).send({ mensaje: 'Solo los administradores tienen permisos' })

    TipoEvento.findByIdAndUpdate(idTipoEvento, { tipo: params.tipo }, { new: true, useFindAndModify: false }, (err, tipoEventoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error al actualizar el tipo evento' })
        if (!tipoEventoActualizado) return res.status(500).send({ mensaje: 'No se pudo actualizar' })

        return res.status(200).send({ tipoEventoActualizado })
    })
}

function eliminarTipoEvento(req, res) {
    var idTipoEvento = req.params.idTipoEvento;
    if (req.user.rol != 'ROL_ADMIN' && req.user.rol != 'ROL_ADMIN_HOTEL') return res.status(500).send({ mensaje: 'Solo los administradores tienen permisos' })

    TipoEvento.findByIdAndRemove(idTipoEvento, (err, tipoEventoEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error al eliminar el tipo de evento' })
        if (!tipoEventoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar tipo de evento' })

        return res.status(200).send({ mensaje: 'Se ha eliminado el tipo de evento' })
    })
}


module.exports = {
    registrarTipoEvento,
    obtenerTipoEventos,
    editarTipoEventos,
    eliminarTipoEvento
}