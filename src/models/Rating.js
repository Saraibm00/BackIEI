const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;

const RatingSchema = new Schema({
    confortRating: {
        type: Number,
        required: true
    },
    comment: {
        type: String
    },
    realfoodRating: {
        type: Number,
        required: true
    },
    priceRating: {
        type: Number,
        required: true
    },
    establishment: {
        type: ObjectId,
        ref: 'Establishment',
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true

    }
});

module.exports = mongoose.model('Rating', RatingSchema );