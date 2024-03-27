'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const jwtKey = 'my_secret_key'
const jwtExpirySeconds = 3000


const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "sshell18_cpt262remote",
    password: "f3b6b5eb-7238-4f07-aaa6-d49848d2ec7c",
    database: "sshell18_Spring2024",
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!!");
});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/public/login.html"));
});

app.get('/getloggedout/', function (req, res) {
    res.cookie('token', 2, { maxAge: 0 })
    res.send({ redirect: '/backend/index.html'});
});

app.get('/getloggedin/', function (req, res) {

    var viewpage = 0;
    var datahold = [];
    const validtoken = req.cookies.token
    console.log('token new:', validtoken);
    var payload;
    
    if(!validtoken) {
        viewpage = 0;
        console.log("NVT");
    } else {
        try {
            payload = jwt.verify(validtoken, jwtKey);
            console.log('payload new:', payload.empkey);
            viewpage = payload.empkey;

            var sqlsel = 'select * from employeetable where dbemployeekey = ?';
            var inserts = [viewpage];

            var sql = mysql.format(sqlsel, inserts);

            con.query(sql, function (err, data) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                console.log("Show 1" + data);
                
                datahold = data;

                res.send(JSON.stringify(data));
            });

          } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                viewpage = 0;
                console.log("NVT2");
            }
            viewpage = 0;
            console.log("NVT3");
          }
    }
    
});

app.post('/loginemp/', function (req, res) {
    var eemail = req.body.employeeemail;
    var epw = req.body.employeepw;

    var sqlsel = 'select * from employeetable where dbemployeeemail = ?';

    var inserts = [eemail];

    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);

    con.query(sql, function (err, data)     {
        //Checks to see if there is data in the result
        if (data.length > 0) {
            console.log("User name correct: ");
            var empkey=data[0].dbemployeekey;
            console.log(data[0].dbemployeekey);

            bcrypt.compare(epw, data[0].dbemployeepassword, function (err, passwordCorrect ) {
                if (err) {
                    throw err;
                } else if (!passwordCorrect) {
                    console.log("Password Incorrect");
                } else {
                    console.log("Password Correct");
                    const token = jwt.sign({ empkey }, jwtKey, {
                        algorithm: 'HS256',
                        expiresIn: jwtExpirySeconds
                      });
                    
                    res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
                    res.send({ redirect: '/backend/searchemployee.html'});
                }
            });
        } else {
            console.log("Incorrect user name or password!!");
        }
    });
});


app.post('/logincust/', function (req, res) {
    var cemail = req.body.customeremail;
    var cpw = req.body.customerpw;

    var sqlsel = 'select * from customertable where dbcustomeremail = ?';

    var inserts = [cemail];

    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);

    con.query(sql, function (err, data)     {
        //Checks to see if there is data in the result
        if (data.length > 0) {
            console.log("User name correct: ");
            console.log(data[0].dbcustomerpassword);

            bcrypt.compare(cpw, data[0].dbcustomerpassword, function (err, passwordCorrect ) {
                if (err) {
                    throw err;
                } else if (!passwordCorrect) {
                    console.log("Password Incorrect");
                } else {
                    console.log("Password Correct");
                    res.send({ redirect: '/insertcustomer.html'});
                }
            });
        } else {
            console.log("Incorrect user name or password!!");
        }
    });
});

app.get('/getemps/', function (req, res) {


    var sqlsel = 'select * from employeetable';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/getcusts/', function (req, res) {


    var sqlsel = 'select * from customertable';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});


app.get('/getemptypes/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM employeetypes';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getsingleemp/', function (req, res) {

    var ekey = req.query.upempkey;

    var sqlsel = 'select * from employeetable where dbemployeekey = ?';
    var inserts = [ekey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleemp', function (req, res, ) {

    var eid = req.body.upemployeeid;
    var ename = req.body.upemployeename;
    var ephone = req.body.upemployeephone;
    var eemail = req.body.upemployeeemail;
    var esalary = req.body.upemployeesalary;
    var emailer = req.body.upemployeemailer;
    var etype = req.body.upemployeetype;
    var ekey = req.body.upemployeekey;
    
    var sqlins = "UPDATE employeetable SET dbemployeeid = ?, dbemployeename = ?, dbemployeeemail = ?, " +
        " dbemployeephone = ?, dbemployeesalary = ?, dbemployeemailer = ?, dbemployeetype =? " +
        " WHERE dbemployeekey = ? ";
    var inserts = [eid, ename, eemail, ephone, esalary, emailer, etype, ekey];

    var sql = mysql.format(sqlins, inserts);
console.log(sql);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});    

app.get('/getemp/', function (req, res) {
    var eid = req.query.employeeid;
    var ename = req.query.employeename;
    var ephone = req.query.employeephone;
    var eemail = req.query.employeeemail;
    var esalary = req.query.employeesalary;
    var emailer = req.query.employeemailer;
    var etype = req.query.employeetype;

    console.log(emailer);

    if (emailer == 1 || emailer == 0) {
        var maileraddon = ' and dbemployeemailer = ?';
        var maileraddonvar = emailer;
    } else {
        var maileraddon = ' and dbemployeemailer Like ?';
        var maileraddonvar = '%%';
    }

    if (etype > 0) {
        var typeaddon = ' and dbemployeetype = ?';
        var typeaddonvar = etype;
    } else {
        var typeaddon = ' and dbemployeetype Like ?';
        var typeaddonvar = '%%';
    }

    var sqlsel = 'SELECT employeetable.*, employeetypes.dbemptypename from employeetable ' +
                'inner join employeetypes on employeetypes.dbemptypeid = employeetable.dbemployeetype ' +
                'where dbemployeeid LIKE ? and dbemployeename LIKE ? ' +
                ' and dbemployeephone LIKE ? and dbemployeeemail LIKE ? and dbemployeesalary LIKE ?'
                + maileraddon + typeaddon;
    
    var inserts = ['%' + eid + '%', '%' + ename + '%', '%' + ephone + '%', '%' + eemail + '%', 
            '%' + esalary + '%', maileraddonvar, typeaddonvar];

    var sql = mysql.format(sqlsel, inserts);

    

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.post('/customer', function (req, res) {
    var cname = req.body.customername;
    var caddress = req.body.customeraddress;
    var czip = req.body.customerzip;
    var ccredit = req.body.customercredit;
    var cemail = req.body.customeremail;
    var cpw = req.body.customerpw;
    console.log("PW: " + cpw);

    var saltRounds = 10;
    var theHashedPW = '';

    bcrypt.hash(cpw, saltRounds, function (err, hashedPassword) {

        if (err) {
            console.log("Bad on encrypt");
            return;
        } else {
            
            theHashedPW = hashedPassword;
            console.log("Password Enc: " + theHashedPW);

            var sqlins = "INSERT INTO customertable (dbcustomername, dbcustomeraddress, dbcustomerzip,"
            + " dbcustomercredit, dbcustomeremail, dbcustomerpassword) VALUES (?, ?, ?, ?, ?, ?)";

            var inserts = [cname, caddress, czip, ccredit, cemail, theHashedPW];

            var sql = mysql.format(sqlins, inserts);

            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.redirect('insertcustomer.html');
                res.end();
            });
        }
    });
});

app.post('/employee', function (req, res,) {

    var eid = req.body.employeeid;
    var ename = req.body.employeename;
    var ephone = req.body.employeephone;
    var eemail = req.body.employeeemail;
    var epw = req.body.employeepw;
    var esalary = req.body.employeesalary;
    var emailer = req.body.employeemailer;
    var etype = req.body.employeetype

    console.log("PW: " + epw);

    var saltRounds = 10;
    var theHashedPW = '';

    bcrypt.hash(epw, saltRounds, function (err, hashedPassword) {

        if (err) {
            console.log("Bad on encrypt");
            return;
        } else {
            
            theHashedPW = hashedPassword;
            console.log("Password Enc: " + theHashedPW);

            var sqlins = "INSERT INTO employeetable (dbemployeeid, dbemployeename, dbemployeeemail, " +
                "dbemployeephone, dbemployeesalary, dbemployeemailer, dbemployeetype, dbemployeepassword) " +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            
            var inserts = [eid, ename, eemail, ephone, esalary, emailer, etype, theHashedPW];
                
            var sql = mysql.format(sqlins, inserts);

            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.send({redirect: 'insertemployee.html'});
                res.end();
            });
        }
    });
});

app.post('/Cart/', function (req, res) {

    var cartemp = req.body.CartEmp;
    var cartcust = req.body.CartCust;

    var sqlsel = 'select MAX(dbcartdailyid) as daymax from cartinfo '
        + ' WHERE DATE(dbcartdate) = CURDATE()';

    var sql = mysql.format(sqlsel);

    var dailynumber = 1;

    con.query(sql, function (err, data) {
        console.log(data[0].daymax);

        if (!data[0].daymax) {
            dailynumber = 1;            
        } else {
            dailynumber = data[0].daymax + 1;
        }

        var sqlinscart = "INSERT INTO cartinfo (dbcartemp, dbcartcust, dbcartdailyid, "
            + "  dbcartpickup, dbcartmade, dbcartdate) VALUES (?, ?, ?, ?, ?, now())";
        var insertscart = [cartemp, cartcust, dailynumber, 0, 0];

        var sqlcart = mysql.format(sqlinscart, insertscart);

        con.execute(sqlcart, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
            res.redirect('insertcart.html');
            res.end();
        });
    });
});

app.get('/getcart/', function (req, res) {
   
    var empid = req.query.employeeid;

    if (empid == 0) {
        var sqlsel = 'Select cartinfo.*, employeetable.dbemployeename, customertable.dbcustomername from cartinfo' +
        ' inner join employeetable on employeetable.dbemployeekey = cartinfo.dbcartemp' +
        ' inner join customertable on customertable.dbcustomerid = cartinfo.dbcartcust' +
        ' ORDER by employeetable.dbemployeename';
        var sql = mysql.format(sqlsel);
    } 
    else {
        var sqlsel = 'Select cartinfo.*, employeetable.dbemployeename, customertable.dbcustomername from cartinfo' +
        ' inner join employeetable on employeetable.dbemployeekey = cartinfo.dbcartemp' +
        ' inner join customertable on customertable.dbcustomerid = cartinfo.dbcartcust' +
        ' where dbcartemp = ? ';
        var inserts = [empid];
        var sql = mysql.format(sqlsel, inserts);
    }
   
    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getcartbydate/', function (req, res) {
   
    var startingdate = req.query.datestart;
    var endingdate = req.query.dateend;
    var empid = req.query.employeeid;
    if (empid == 0) {
        var sqlsel = 'Select cartinfo.*, employeetable.dbemployeename, customertable.dbcustomername from cartinfo' +
        ' inner join employeetable on employeetable.dbemployeekey = cartinfo.dbcartemp' +
        ' inner join customertable on customertable.dbcustomerid = cartinfo.dbcartcust' +
        ' where dbcartdate > ? AND dbcartdate < ?' +
        ' ORDER BY dbcartdate';
        var inserts = [startingdate, endingdate];
        var sql = mysql.format(sqlsel, inserts);
    }
    else {
        var sqlsel = 'Select cartinfo.*, employeetable.dbemployeename, customertable.dbcustomername from cartinfo' +
        ' inner join employeetable on employeetable.dbemployeekey = cartinfo.dbcartemp' +
        ' inner join customertable on customertable.dbcustomerid = cartinfo.dbcartcust' +
        ' where dbcartdate > ? AND dbcartdate < ? AND dbcartemp = ? ' +
        ' ORDER BY dbcartdate';

        var inserts = [startingdate, endingdate, empid];
        var sql = mysql.format(sqlsel, inserts);
    }


    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});


app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
