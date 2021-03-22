'use strict'
const app = require('./app');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/gestorHoteles', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {

    console.log('Conectado a la base de datos gestorHoteles');
    app.listen(3000, function() { console.log('Se encuentra corriendo en el puerto 3000'); })

}).catch(err => console.log(err))