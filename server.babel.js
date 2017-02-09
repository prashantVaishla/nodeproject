var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

const path = require('path');

var server = require("http");
var MongoStore = require('connect-mongo')(session);
var configDB = require('./config/database');
var mongoose = require('mongoose');

var conn = mongoose.connect(configDB.url);

app.set('Views', __dirname + '/Views');
app.engine('html', require('ejs').renderFile);
// Make folders accessible
app.use('/content', express.static(path.join(__dirname, '/content')));
app.use('/jquery', express.static(path.join(__dirname, '/jquery')));

// Create Sessions in MongoDB
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    clear_interval: 900,
    cookie: { maxAge: new Date(Date.now() + (2 * 60 * 60 * 1000)) },
    key: 'express.sid',
    store: new MongoStore({
        mongooseConnection: conn.connection,
        collection: 'usersessions'
    })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + configDB.url);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

// Initialize Routes
require('./routes/routes.js')(app, server);

app.listen(3000, function () {
    console.log("App Started on PORT 3000");
});

console.log("Connected......");