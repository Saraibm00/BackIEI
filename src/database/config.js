const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        
        await mongoose.connect( process.env.BD_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authMechanism: 'SCRAM-SHA-1',
            dbName: process.env.BD_NAME,
            user: process.env.BD_USER,
            pass: process.env.BD_PASS,
        });

        console.log('Database successfully connected. Name:', process.env.BD_NAME);

    } catch (error) {
        console.log(error);
        throw new Error('Error with DB connection');
    }
}

module.exports = {
    dbConnection
}