/// <reference path="routes.js" />

var sessionMan = require('./sessionManagement');
var connectionDB = require('../config/conn');
var async = require('async');

module.exports = function (app, server) {

    var sess;

    app.get('/', function (req, res) {

        //console.log('Request: '+ req.db);
        sess = sessionMan.getSessionObj(req);
        console.log(sessionMan.getSessionID(req));
        //Session set when user Request our app via URL
        if (sess.userName && sess.authorized) {
            res.redirect('/home');
        }
        else {
            res.redirect('/login');
        }
    });

    app.get('/login', function (req, res) {
        // console.log('Request: ' + req.db);
        res.render('index.ejs');
    });

    app.post('/login', function (req, res) {
        sess = req.session;
        // Assigning username to session variable
        sess.userName = req.body.userName;

        //getting data from login form
        var item = {
            Username: req.body.userName,
            Password: req.body.pass
        };



        var result = connectionDB.authenticate(item.Username, item.Password, function (err, results) {
            if (results == true) {
                sess.authorized = true;
                res.end('done');
            }
            else {
                sess.authorized = false;
                console.log('Error for login POST Method: ' + err);
                res.end('error');
            }

        });



        /* if(result == true)
		{
			res.end('done');
		}
		else
		{
			res.end('error');
		} */
        /* var flag = false;
      //NEW ADDITION START
        var collection = db.collection('LOGIN');
         collection.find().toArray(function (err, dataVal) {

                if (!err) {
                    if (item.Username == dataVal[0].username && item.Password == dataVal[0].password) {
                        console.log("User - " + item.Username + "  authenticated!");
                        res.end('done');
                        flag = true;

                        console.log(flag);
                        res.end('done');
                    }
                    else {
                        console.log("try again");
                        res.render('ErrorPage.ejs', { myVar: sess.userName });
                        res.end();
                         res.redirect('/error');
                        res.end('error');
                    }
                }

            }
           ); */
        //db.close();
        //NEW ADD FNSH

    });

    app.all('*', function (req, res, next) {

        sess = req.session;

        if (sess && sess.authorized) {
            //console.log('Authorized - Move to next screen');
            next();
        } else {
            //console.log('Error - 401');
            next(new Error(401)); // 401 Not Authorized
        }
    });

    app.use(function (err, req, res, next) {
        // Just basic, should be filled out to next()
        // or respond on all possible code paths
        if (err instanceof Error) {
            if (err.message === '401') {
                console.log('Error - 401');
                res.redirect('/login');
            }
        }
    });

    app.get('/error', function (req, res) {
        sess = req.session;
        res.render('ErrorPage.ejs', { myVar: 'Username or password is incorrect' });
        res.end();
    });

    app.get('/home', function (req, res) {
        sess = req.session;
        //if (sess.userName) {
        res.render('HomePage.ejs', { myVar: sess.userName });
        res.end('<a href="/logout">Logout</a>');
        //} else {
        //    res.write('<h1>Please login first.</h1>');
        //    res.end('<a href="/login">Login</a>');
        //}
    });

    app.get('/CreateProductQuality', function (req, res) {
        res.render('CreateProductQuality.ejs', { myVar: req.session.userName });
    });

    app.post('/CreateProductQuality', function (req, res) {
        var items = {
            complaintSummary: req.body.complaintSummary,
            barCode: req.body.barCode,
            tpnb: req.body.tpnb,
            tpnc: req.body.tpnc,
            storeNumber: req.body.storeNumber,

        };
        //validations using node Validator

        var caseId; 
        var dataNtime1 = new Date();
 
        async.series([
            //Load user to get `userId` first
           function (call) {
               connectionDB.counterId(function (error, results) {
                   caseId = results;

                   console.log('results Id:' + caseId);

                   call();
               })
           },
            //Load posts (won't be called before task 1's "task callback" has been called)
            function (call) {
                var document = { _id: caseId, complaintSummary: items.complaintSummary, barCode: items.barCode, tpnb: items.tpnb, tpnc: items.tpnc, storeNumber: items.storeNumber, userName: req.session.userName, dataNtime: dataNtime1 };

                connectionDB.createCase(document, function (error, result) {
                    if (!error) {
                        console.log("record inserted!");
                        caseId = result;
                    } else {
                        console.log('create case error' + error);
                    }
                    call();
                })
            }
        ], function (err) { //This function gets called after the two tasks have called their "task callbacks"
            if (err) return next(err);

            res.send(caseId.toString());
        });
    });

    app.get('/SearchCase', function (req, res) {

        res.render('newSearchPage.ejs', { myVar: req.session.userName });

    });

    app.get('/logout', function (req, res) {
        req.session.destroy()

        res.redirect('/login');
    });

    app.get('/storeInfo', function (req, res) {
        sess = req.session;
        var storeId = parseInt(req.query.storeNumber);



        connectionDB.searchStore(storeId, function (error, results) {
            if (!error && results != "") {
                res.send(results);
            } else {
                console.log(error);
            }
        });
    });

    app.get('/productInfo', function (req, res) {
        sess = req.session;

        var barCode = req.query.barCode;
        var tpnb = req.query.tpnb;
        console.log(tpnb);
        var tpnc = req.query.tpnc;
        var queryVar;
        var queryStr;
        if (barCode != "") {
            queryVar = barCode;
            queryStr = "barCode";
        } else if (tpnb != "") {
            console.log("inside tpnb");
            queryVar = tpnb;
            queryStr = "TPNB";
        } else {
            queryVar = tpnc;
            queryStr = "TPNC";
        }

        connectionDB.searchSupplier(queryStr, queryVar, function (error, result) {
            if (!error && result != "") {
                res.send(result);
            } else {
                console.log(error);

            }
        });
    });

    app.get('/SearchCaseItem', function (req, res) {
        
        sess = req.session;
        var caseId = req.query.caseId;
        var userName = sess.userName;
        var Owner = req.query.Owner;
        var datafrom = req.query.createdfrom;
        var dataTo = req.query.createdTo;

        var queryVar;
        var queryStr;

        if (caseId != "") {
            //console.log("caseId");
            queryVar = parseInt(caseId);
            queryStr = "_id";
        } else if (Owner != "") {
            //console.log("inside Owner");
            queryVar = Owner;
            queryStr = "userName";
        } else if ((caseId != "") && (Owner != "")) {
            //console.log("caseId++++++++");
            queryStr = "_id", "userName";
            queryVar = parseInt(caseId), Owner;
        }

        connectionDB.searchCase(queryStr, queryVar, function (error, result) {
            if (!error && result != "") {
                res.send(result);
                res.end();
            } else {
                console.log(error);
                res.end();
            }
        });
    });

}