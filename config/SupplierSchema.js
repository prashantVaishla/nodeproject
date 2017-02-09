// config/loginSchema.js
//Load the mongoose module
var mongoose = require('mongoose');
//var configDB = require('../config/database');

/**
 * Define our Model for User entity. This model represents a collection in the database.
 * We define the possible schema of User document and data types of each field.
 * */
 
var Schema = mongoose.Schema;

var searchSupplierSchema = new Schema({
    barCode : String,
    TPNB : String,
    TPNC : Number,
    Product_Description : String,
    Supplier: String
	});

module.exports = mongoose.model('ProductList', searchSupplierSchema);
