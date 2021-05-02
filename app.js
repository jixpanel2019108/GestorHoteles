const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

const usuario_ruta = require('./src/routes/usuarioRoutes')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', usuario_ruta)

module.exports = app;