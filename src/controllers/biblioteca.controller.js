const { response } = require('express');
const https = require('https');
const http = require('http');
const Biblioteca = require('../models/Biblioteca');
const Provincia = require('../models/Provincia');
const Localidad = require('../models/Localidad');
const mongoose = require('mongoose');
const Type = mongoose.Types;

const request = require("request-promise"),
    RUTA = "http://127.0.0.1:5000/vascos";



const cargarBibliotecasCat = async(req, res = response) => {

    //const { confortRating, comment, realfoodRating, priceRating, establishment, user } = req.body;

}

const cargarBibliotecasEuskadi = async(req, res = response) => {

    //const { confortRating, comment, realfoodRating, priceRating, establishment, user } = req.body;
    let bibliotecas = [];

    let nuevasBibliotecas = [];
    let nuevasLocalidades = [];
    let nuevasProvincias = [];

    await request({
        uri: RUTA,
        json: true, // Para que lo decodifique automáticamente 
    }).then(resp => {
        bibliotecas = resp.data;
        //console.log(bibliotecas);
    });

    console.log(bibliotecas);

    bibliotecas.forEach(element => {

        console.log(element['phone']);

        const { 
            documentName,
            documentDescription,
            libraryTimeTable,
            librarySummerTimeTable,
            latitudelongitude,
            latwgs84,
            lonwgs84,
            placename,
            address,
            municipality,
            municipalitycode,
            postalcode,
            territory,
            territorycode,
            country,
            countrycode,
            phone,
            email,
            webpage,
            friendlyUrl,
            physicalUrl,
            dataXML,
            metadataXML,
            zipFile
         } = element;

        let idProvincia = Type.ObjectId();
        let idLocalidad = Type.ObjectId();

        const nuevaProvincia = new Provincia({
            _id: idProvincia,
            nombre: territory,
            codigo: postalcode[0]+postalcode[1]
        })

        nuevasProvincias.push(nuevaProvincia);

        const nuevaLocalidad = new Localidad({
            _id: idLocalidad,
            nombre: municipality,
            codigo: postalcode.toString().replace('.', ""),
            en_provincia: idProvincia
        })

        nuevasLocalidades.push(nuevaLocalidad);

        const nuevaBiblioteca = new Biblioteca({
            _id: Type.ObjectId(),
            nombre: documentName,
            tipo: 'Publica',
            direccion: address,
            codigoPostal: postalcode.toString().replace('.', ""),
            longitud: lonwgs84,
            latitud: latwgs84,
            telefono: (phone.replace(/ /g, "")).substring(0, 9),
            email: email,
            descripcion: documentDescription,
            en_localidad: idLocalidad
        })

        nuevasBibliotecas.push(nuevaBiblioteca);
    });

    try{
        
        console.log(nuevasProvincias);

        console.log(nuevasLocalidades);

        console.log(nuevasBibliotecas);

        await Provincia.insertMany(nuevasProvincias, function(err, result) {
            // Your treatement
        });

        // console.log(nuevasLocalidades[0]);

        // nuevasLocalidades[0].save();

        await Localidad.insertMany(nuevasLocalidades, function(err, result) {
            // Your treatement
        });

        await Biblioteca.insertMany(nuevasBibliotecas, function(err, result) {
            console.log(err);
        });

        // Generate response
        return res.status(201).json({
            ok: true,
            msg: 'Bibliotecas creadas correctamente!'
        });

     
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Please, talk with administrator'
        });
    }

}

const cargarBibliotecasValencia = async(req, res = response) => {

    
}

const eliminarDatos = async(req, res = response) => {

    await Biblioteca.deleteMany({});
    await Localidad.deleteMany({});
    await Provincia.deleteMany({});

    // Generate response
    return res.status(201).json({
        ok: true,
        msg: 'Bibliotecas eliminadas correctamente!'
    });

}


module.exports = {
    cargarBibliotecasCat,
    cargarBibliotecasEuskadi,
    cargarBibliotecasValencia,
    eliminarDatos
}
