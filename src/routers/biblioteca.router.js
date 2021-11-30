const { Router } = require('express');
const { check } = require('express-validator');
const { cargarBibliotecasCat, cargarBibliotecasEuskadi, cargarBibliotecasValencia, eliminarDatos, cargarTodasLasBibliotecas } = require('../controllers/biblioteca.controller');

const router = Router();

router.get('/cargarBibliotecasEuskadi', cargarBibliotecasEuskadi);

router.get('/cargarBibliotecasCat', cargarBibliotecasCat);

router.get('/cargarBibliotecasValencia', cargarBibliotecasValencia);

router.get('/cargarTodasLasBibliotecas', cargarTodasLasBibliotecas);

router.get('/eliminarDatos', eliminarDatos);

module.exports = router;