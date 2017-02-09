// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(username, done) {
        // User.findById(id, function(err, user) {
            // done(err, user);
        // });
		
		function findByUsername(username, fn) {
			MongoClient.connect('mongodb://localhost:27017/Application_DB', function (err, db) {
            var myPassword = "";
            //console.log(err);
            if (err == null) {
                //console.log("We are connected");
                var myPass = db.collection('LOGIN').find({ "username": item.Username }, { _id: 0, username: 0 });
                myPass.forEach(function (doc, err) {
                    console.log(err);
                    assert.equal(null, err);
                    myPassword = doc.password;
                }
                , function () {
                    //paswrd = myPassword;
                    db.close();
                    if (myPassword == item.Password) {
                        res.end('done');
                    }
                    else {
                        console.log("try again");
                        // res.render('/login', { fhgfhg: sess.userName, Error: "" });
                        //res.end();
                        //res.redirect('/error');
                        res.end('error');
                    }
                });
            }
            else {
                res.send('connError');

            }
        });
			
			
			
			
			
			db.collection("LOGIN", function(err, collection) {
			collection.find({}, {}, function(err, users) {
				users.each(function(err, user) {
					if (user.email === email) {
						return fn(null, user);
					}
				});
            return fn(null, null);
        });
    });
}
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with username
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with username and password from our form

        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

};