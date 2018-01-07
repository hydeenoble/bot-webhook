let _config = require('config.json')('./config/app.json');
// Bring Mongoose into the app
var mongoose = require( 'mongoose' );

// Build the connection string
var dbURI = 'mongodb://' + _config.mongodb.username + ':' + _config.mongodb.password + '@' + _config.mongodb.host + ':' + _config.mongodb.port + '/' + _config.mongodb.db;
// var dbURI = 'mongodb://' + _config.local_mongodb.host + ':' + _config.local_mongodb.port + '/' + _config.local_mongodb.db;


// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

module.exports = {mongoose};
