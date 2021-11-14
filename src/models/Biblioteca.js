const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BibliotecaSchema = new Schema({
    nombre: {
        type: String
    },
    tipo: {
        type: String,
        enum : ['Publica', 'Privada'],
        default: 'Publica'
    },
    direccion: {
        type: String
    },
    codigoPostal: {
        type: String
    },
    longitud: {
        type: Number
    },
    latitud: {
        type: Number
    },
    telefono: {
        type: String,
    },
    email: {
        type: String,
    },
    descripcion: {
        type: String
    },
    en_localidad: {
        type: ObjectId,
        ref: 'Localidad'
    },
});

module.exports = mongoose.model('Biblioteca', BibliotecaSchema );