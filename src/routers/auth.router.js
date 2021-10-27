const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, revalidateToken } = require('../controllers/auth.controller');
const { validateFields } = require('../services/validate-params/validate-fields');
const { validateJWT } = require('../services/validate-params/auth.validate/validate-jwt');

const router = Router();

// Create new user
router.post( '/new', [
    check('name', 'name is mandatory').not().isEmpty(),
    check('email', 'email is mandatory').isEmail(),
    check('password', 'password is mandatory').isLength({ min: 6 }),
    validateFields
], createUser );


// User Login
router.post( '/', [
    check('email', 'email is mandatory').isEmail(),
    check('password', 'password is mandatory').isLength({ min: 6 }),
    validateFields
], loginUser );

// Validate and revalidate token
router.get( '/renew', validateJWT , revalidateToken );


module.exports = router;