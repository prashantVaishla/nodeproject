var express = require('express');
var session = require('express-session');
var app = express();


module.exports = {
    getSessionID: function (req) {
        return (req.sessionID);
    },

    getSessionObj: function (req) {
        return (req.session);
    }
};
