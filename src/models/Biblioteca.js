const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;

const BibliotecaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum : ['Publica', 'Privada'],
        default: 'Publica'
    },
    direccion: {
        type: String,
        required: true
    },
    codigoPostal: {
        type: String,
        required: true
    },
    longitud: {
        type: Number,
        required: true
    },
    latitud: {
        type: Number,
        required: true
    },
    telefono: {
        type: String,
    },
    email: {
        type: String,
    },
    descripcion: {
        type: String,
        required: true
    },
    en_localidad: {
        type: ObjectId,
        ref: 'Localidad',
        required: true
    },
});

module.exports = mongoose.model('Biblioteca', BibliotecaSchema );