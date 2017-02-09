// config/connectMongo.js
//Load the mongoose module
var mongoose = require('mongoose');
var configDB = require('./database');
module.exports = {
    connectMongoDB:function() {
       //Lets connect to our database using the DB server URL.
        mongoose.connect(configDB.url);
        //mongoose.createConnection(configDB.url);
        //return mongoose.connection;
        return mongoose;
   }

};
