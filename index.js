const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./src/database/config');
require('dotenv').config();

// Create express server/application
const app = express();

// DataBase
dbConnection();

// Public directory
app.use( express.static('src/public') );

// CORS
app.use( cors() );

// Sent and receive json format
app.use( express.json() );


// Routes
app.use( '/api/biblioteca', require('./src/routers/biblioteca.router') );

// Manage other routes (for Angular)
app.get( '*', ( req, res ) => {
    res.sendFile( path.resolve( __dirname, 'src/public/index.html') );
});

app.listen( process.env.PORT, () => {
    console.log(`Server in port ${ process.env.PORT }`);
});

