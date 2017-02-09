// config/loginSchema.js
//Load the mongoose module
var mongoose = require('mongoose');

/**
 * Define our Model for User entity. This model represents a collection in the database.
 * We define the possible schema of User document and data types of each field.
 * */
 
var Schema = mongoose.Schema;

var caseSchema = new Schema({
    _id:Number,
    complaintSummary : String,
    barCode : String,
    tpnb : String,
    tpnc : String,
    storeNumber : String,
    userName : String,
    dataNtime : Date
 
	});

module.exports = mongoose.model('CreateCase', caseSchema, 'CreateCase');
