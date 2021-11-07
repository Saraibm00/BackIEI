const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;

const LocalidadSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    codigo: {
        type: String,
        required: true
    },
    en_provincia: {
        type: ObjectId,
        ref: 'Provincia',
        required: true
    },
});

module.exports = mongoose.model('Localidad', LocalidadSchema );