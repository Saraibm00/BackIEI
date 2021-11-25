
const { response } = require('express');
const https = require('https');
const http = require('http');
const Biblioteca = require('../models/Biblioteca');
const Provincia = require('../models/Provincia');
const Localidad = require('../models/Localidad');
const mongoose = require('mongoose');
const Type = mongoose.Types;

const csvToJson = require('convert-csv-to-json');
const request = require("request-promise");

const xml2js = require('xml2js');

const myAPIKey = "683c4b6f336d474cb157f818958cb987";

const RUTAEUS = "http://127.0.0.1:5000/euskadiJson",
    RUTACAT = "http://127.0.0.1:5000/catJson",
    RUTACV = "http://127.0.0.1:5000/valencia";

const {Builder, By, Key, until} = require('selenium-webdriver');

const firefox = require('selenium-webdriver/firefox');

async function example() {
      let driver = await new Builder().forBrowser('firefox').build();
      try {
        await driver.get('http://www.google.com/ncr');
        await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
        //await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
      } catch(e){
        console.log(e);
        console.log(driver);
      }
      finally {
        await driver.quit();
      }
};
example();

const cargarBibliotecasCat = async(req, res = response) => {

    let bibliotecas = [];
    let xml = '';

    let nuevasBibliotecas = [];
    let nuevasLocalidades = [];
    let nuevasProvincias = [];

    await request({
        uri: RUTACAT,
        json: true, // Para que lo decodifique automáticamente 
    }).then(resp => {
        xml = resp.data;
        //console.log(xml);
    });

    // convert XML to JSON
    xml2js.parseString(xml, (err, result) => {

        if(err) {
            throw err;
        }

        // `result` is a JavaScript object
        // convert it to a JSON string
        const jsonString = JSON.stringify(result, null, 4);
        const json = JSON.parse(jsonString);
        // log JSON string
        //console.log(json.response.row);
        bibliotecas = json.response.row;
    });

    //console.log(bibliotecas);

    bibliotecas.forEach(element => {

        // console.log(element['telefon1']);

        const { 
            nom,
            propietats,
            via,
            cpostal,
            longitud,
            latitud,
            telefon1,
            email,
            alies,
            poblacio,
            codi_municipi
         } = element;

        const name = convetirAString(nom);
        const properties = convetirAString(propietats);
        const street = convetirAString(via);
        const zipCode = convetirAString(cpostal);
        const longitude = convetirAString(longitud);
        const latitude = convetirAString(latitud);
        const telephone = convetirAString(telefon1);
        const emailB = convetirAString(email);
        const aka = convetirAString(alies);
        const poblation = convetirAString(poblacio);
        const municipalCode = convetirAString(codi_municipi);

        let idProvincia = Type.ObjectId();
        let idLocalidad = Type.ObjectId();

        //console.log(typeof cpostal);

        let nombreProvincia = obtenerNombreCP(zipCode.substring(0,2));

        const nuevaProvincia = new Provincia({
            _id: idProvincia,
            nombre: nombreProvincia,
            codigo: zipCode.substring(0,2)
        })

        nuevasProvincias.push(nuevaProvincia);

        const nuevaLocalidad = new Localidad({
            _id: idLocalidad,
            nombre: poblation,
            codigo: municipalCode,
            en_provincia: idProvincia
        })

        nuevasLocalidades.push(nuevaLocalidad);

        let tipo = 'Publica';
        if(properties.indexOf('Altra titularitat') != -1) {
            tipo = 'Privada';
        }

        const nuevaBiblioteca = new Biblioteca({
            _id: Type.ObjectId(),
            nombre: name,
            tipo: tipo,
            direccion: street,
            codigoPostal: zipCode,
            longitud: longitude,
            latitud: latitude,
            telefono: (telephone.replace(/ /g, "")).substring(0, 9),
            email: emailB,
            descripcion: aka,
            en_localidad: idLocalidad
        })

        nuevasBibliotecas.push(nuevaBiblioteca);
    });

    //console.log(nuevasBibliotecas);

    try{
        
        // console.log(nuevasProvincias);

        // console.log(nuevasLocalidades);

        // console.log(nuevasBibliotecas);

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

const cargarBibliotecasEuskadi = async(req, res = response) => {

    //const { confortRating, comment, realfoodRating, priceRating, establishment, user } = req.body;
    let bibliotecas = [];

    let nuevasBibliotecas = [];
    let nuevasLocalidades = [];
    let nuevasProvincias = [];

    await request({
        uri: RUTAEUS,
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

    let bibliotecas = [];
    let jsonVal = {};
    let csv;

    let nuevasBibliotecas = [];
    let nuevasLocalidades = [];
    let nuevasProvincias = [];

    await request({
        uri: RUTACV,
        json: true, // Para que lo decodifique automáticamente 
    }).then(resp => {
        csv = resp.data;
        // console.log(csv);
        // csvToJson.generateJsonFileFromCsv(csv, jsonVal);
        bibliotecas = csvJSON(csv);
    });

    //console.log(bibliotecas);

    bibliotecas.forEach(element => {

        // console.log(element['telefon1']);

        const { 
            COD_PROVINCIA,
            NOM_PROVINCIA,
            COD_MUNICIPIO,
            NOM_MUNICIPIO,
            TIPO,
            NOMBRE,
            DIRECCION,
            CP,
            TELEFONO,
            FAX,
            WEB,
            CATALOGO,
            EMAIL,
            CENTRAL,
            COD_CARACTER,
            DESC_CARACTER,
            DECRETO
         } = element;

        let idProvincia = Type.ObjectId();
        let idLocalidad = Type.ObjectId();

        //console.log(typeof cpostal);

        const nuevaProvincia = new Provincia({
            _id: idProvincia,
            nombre: NOM_PROVINCIA,
            codigo: COD_PROVINCIA
        })

        nuevasProvincias.push(nuevaProvincia);

        const nuevaLocalidad = new Localidad({
            _id: idLocalidad,
            nombre: NOM_MUNICIPIO,
            codigo: COD_MUNICIPIO,
            en_provincia: idProvincia
        })

        nuevasLocalidades.push(nuevaLocalidad);

        // let tipo = 'Publica';
        // if(properties.indexOf('Altra titularitat') != -1) {
        //     tipo = 'Privada';
        // }

        // let address = DIRECCION + ', ' + NOM_MUNICIPIO;

        // const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${myAPIKey}`;

        // // call Geocoding API - https://www.geoapify.com/geocoding-api/
        // fetch(geocodingUrl).then(result => result.json())
        // .then(featureCollection => {
        //     console.log(featureCollection);
        // });

        const nuevaBiblioteca = new Biblioteca({
            _id: Type.ObjectId(),
            nombre: NOMBRE,
            tipo: 'P' + DESC_CARACTER.substring(1).toLowerCase(),
            direccion: DIRECCION,
            codigoPostal: CP,
            longitud: 1,
            latitud: 2,
            telefono: TELEFONO.substring(5),
            email: EMAIL,
            descripcion: TIPO,
            en_localidad: idLocalidad
        })

        nuevasBibliotecas.push(nuevaBiblioteca);
    });

    //console.log(nuevasBibliotecas);

    // try{
        

    //     await Provincia.insertMany(nuevasProvincias, function(err, result) {
    //         // Your treatement
    //     });

    //     // console.log(nuevasLocalidades[0]);

    //     // nuevasLocalidades[0].save();

    //     await Localidad.insertMany(nuevasLocalidades, function(err, result) {
    //         // Your treatement
    //     });

    //     await Biblioteca.insertMany(nuevasBibliotecas, function(err, result) {
    //         console.log(err);
    //     });

    //     // Generate response
    //     return res.status(201).json({
    //         ok: true,
    //         msg: 'Bibliotecas creadas correctamente!'
    //     });

     
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({
    //         ok: false,
    //         msg: 'Please, talk with administrator'
    //     });
    // }

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

function convetirAString(valor) {
    if(valor !== undefined){
        return valor.toString().trim();
    }
    else {
        return '';
    }
}

function obtenerNombreCP(dosDigitosCP) {

    const json = {
        '01': 'Álava',
        '02': 'Albacete',
        '03': 'Alicante',
        '04': 'Almería',
        '05': 'Ávila',
        '06': 'Badajoz',
        '07': 'Baleares',
        '08': 'Barcelona',
        '09': 'Burgos',
        '10': 'Cáceres',
        '11': 'Cádiz',
        '12': 'Castellón',
        '13': 'Ciudad Real',
        '14': 'Córdoba',
        '15': 'La Coruña',
        '16': 'Cuenca',
        '17': 'Gerona/Girona',
        '18': 'Granada',
        '19': 'Guadalajara',
        '20':	'Guipúzcoa',
        '21':	'Huelva',
        '22':   'Huesca',
        '23':	'Jaén',
        '24':	'León',
        '25':	'Lérida/Lleida',
        '26':	'La Rioja',
        '27':	'Lugo',
        '28':	'Madrid',
        '29':	'Málaga',
        '30':	'Murcia',
        '31':	'Navarra',
        '32':	'Orense',
        '33':	'Asturias',
        '34':	'Palencia',
        '35':	'Las Palmas',
        '36':	'Pontevedra',
        '37':	'Salamanca',
        '38':	'Santa Cruz de Tenerife',
        '39':	'Cantabria',
        '40':	'Segovia',
        '41':	'Sevilla',
        '42':	'Soria',
        '43':	'Tarragona',
        '44':	'Teruel',
        '45':	'Toledo',
        '46':	'Valencia',
        '47':	'Valladolid',
        '48':	'Vizcaya',
        '49':	'Zamora',
        '50':	'Zaragoza',
        '51':	'Ceuta',
        '52':	'Melilla'
    }

    return json[dosDigitosCP];
}

function csvJSON(csv){

    var lines=csv.split("\n");
    // console.log(lines[1]);
    // console.log('Patata');

    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[0].split(";");
  
    let res = [];

    for(var i=1;i<lines.length-1;i++){
  
        var obj = {};
        var row = [];
        var currentline=lines[i].split(";");
  
        for(var j=0; j<headers.length; j++){
            obj[headers[j]] = currentline[j];
            row.push(obj);
        }
  
        res.push(obj);
  
    }
  
    //return result; //JavaScript object
    return res; //JSON
}

module.exports = {
    cargarBibliotecasCat,
    cargarBibliotecasEuskadi,
    cargarBibliotecasValencia,
    eliminarDatos
}
