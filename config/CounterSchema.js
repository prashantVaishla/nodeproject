// config/loginSchema.js
//Load the mongoose module
var mongoose = require('mongoose');
//var configDB = require('../config/database');

/**
 * Define our Model for User entity. This model represents a collection in the database.
 * We define the possible schema of User document and data types of each field.
 * */
 
var Schema = mongoose.Schema;

var counterSchema = new Schema({
    _id:String,
    seq: Number
	});

module.exports = mongoose.model('counters', counterSchema);
