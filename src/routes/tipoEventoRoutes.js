const express = require('express')
const tipoEventoController = require('../controllers/tipoEventoController')

var md_autenticacion = require('../middlewares/authenticated');

api = express.Router()
api.post('/registrarTipoEvento', md_autenticacion.ensureAuth, tipoEventoController.registrarTipoEvento);
api.get('/obtenerTipoEventos', md_autenticacion.ensureAuth, tipoEventoController.obtenerTipoEventos);
api.get('/obtenerTipoEventosPorId/:idEvento', md_autenticacion.ensureAuth, tipoEventoController.obtenerTipoEventosPorId)
api.put('/editarTipoEventos/:idTipoEvento', md_autenticacion.ensureAuth, tipoEventoController.editarTipoEventos);
api.delete('/eliminarTipoEvento/:idTipoEvento', md_autenticacion.ensureAuth, tipoEventoController.eliminarTipoEvento)

module.exports = api