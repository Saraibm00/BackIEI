const { response } = require('express');
const Rating = require('../models/Rating');
const mongoose = require('mongoose');
const Type = mongoose.Types;

const createRating = async(req, res = response) => {

    const { confortRating, comment, realfoodRating, priceRating, establishment, user } = req.body;
    
    // Create establishment with model
    const newRating= new Rating({
          _id: Type.ObjectId(),
          confortRating: confortRating,
          comment: comment,
          realfoodRating: realfoodRating,
          priceRating: priceRating,
          establishment: establishment,
          user: user
    })

    try{
        
        // Create DB establishment
        await newRating.save();

        // Generate response
        return res.status(201).json({
            ok: true,
            ratings: []
        });

     
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please, talk with administrator'
        });
    }

}

const obtainRatingEstablishment = async(req, res = response) => {

    Rating.find({establishment: req.params.id}).then(function(rating){
        res.status(200).json({
            ok: true,
            ratings: rating
        });
    });

};

const obtainUserRating = async(req, res = response) => {

    Rating.find({user: req.params.id}).then(function(rating){
        res.send(rating);
    });

};

module.exports = {
    createRating,
    obtainRatingEstablishment,
    obtainUserRating
}