const { Router } = require('express');
const { check } = require('express-validator');
const { createRating,obtainRatingEstablishment,obtainUserRating } = require('../controllers/rating.controller');
const { validateFields } = require('../services/validate-params/validate-fields');
const router = Router();

router.post( '/new', [
    check('confortRating', 'confortRating is mandatory').not().isEmpty(),
    check('realfoodRating', 'realfoodRating is mandatory').not().isEmpty(),
    check('priceRating', 'priceRating is mandatory').not().isEmpty(),
    check('establishment', 'establishment is mandatory').not().isEmpty(),
    validateFields
], createRating );

router.get('/obtainRatingEstablishment/:id', obtainRatingEstablishment);

router.get('/obtainUserRating/:id', obtainUserRating);

module.exports = router;