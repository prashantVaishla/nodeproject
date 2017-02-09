// config/conn.js
//Load the mongoose module
var mongoose = require('mongoose');
var configDB = require('./database');

/**
 * Define our Model for User entity. This model represents a collection in the database.
 * We define the possible schema of User document and data types of each field.
 * */

var Login = mongoose.model('LOGIN', require('./LoginSchema'), 'LOGIN');
var counter = mongoose.model('counters', require('./CounterSchema'), 'counters');
var storeDetails = mongoose.model('StoreList', require('./StoreSchema'), 'StoreList');
var supplierSchema = mongoose.model('ProductList', require('./SupplierSchema'), 'ProductList');
var CaseSchema = require('./CaseSchema');

module.exports = {

    authenticate: function (username1, password1, callback) {

        var db = mongoose.connection;

        var value;
        //Lets try to Find a user
        console.log('Connected' + username1);

        Login.findOne({ "username": username1, "password": password1 }, function (err, userObj) {
            if (err) {
                value = false;
            } else if (userObj) {

                value = true;

            } else {

                value = false;
            }

            callback(err, value);
        });
    },

    counterId: function (callback) {
        var db = mongoose.connection;

        counter.findByIdAndUpdate(
        { _id: "caseId" },
            { $inc: { seq: 1 } },
                function (err, autoCaseId) {
                    console.log('inside counter open findOneAndUpdate');
                    if (err) {
                        console.log('counterr', err);
                    }
                    console.log(autoCaseId);

                    callback(err, autoCaseId.seq); // caseId
                });

    },

    createCase: function (document, callback) {
        var db = mongoose.connection;

        var CaseSchemaModel = new CaseSchema({
            _id: document._id,
            complaintSummary: document.complaintSummary, barCode: document.barCode,
            tpnb: document.tpnb, tpnc: document.tpnc, storeNumber: document.storeNumber, userName: document.userName,
            dataNtime: document.dataNtime
        });

        CaseSchemaModel.save(function (err, caseSaved, numAffected) {
            if (err) {
                console.log(err);
            }

            callback(err, caseSaved._id);
        });
    },

    searchStore: function (storeId, callback) {
        var db = mongoose.connection;

        storeDetails.find({ "storeNumber": storeId }, function (error, dataVal) {
            if (error) {
                console.log("can't fetch store list");
            } else {
                console.log("success!!");
            }

            callback(error, dataVal);
        });
    },

    searchSupplier: function (queryStr, queryVar, callback) {
        var db = mongoose.connection;

        var query = {};
        query[queryStr] = queryVar;

        supplierSchema.find(query, function (error, dataVal) {
            if (error) {
                console.log("can't fetch supplier list");
            } else {
                console.log("supplier found");
            }

            callback(error, dataVal);
        });
    },

    searchCase: function (queryStr, queryVar, callback) {

        var db = mongoose.connection;

        var query = {};
        query[queryStr] = queryVar;


        CaseSchema.find(query, function (error, dataVal) {
            if (error) {
                console.log("can't fetch case list");
            }

            callback(error, dataVal);
        });

    }
}
