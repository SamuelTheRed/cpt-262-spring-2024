'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// --v
const mysql = require('mysql2'); 

const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "sshell18_cpt262remote",
    password: "f3b6b5eb-7238-4f07-aaa6-d49848d2ec7c",
    database: "sshell18_Spring2024"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
// --^
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// --v
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/insertemployee.html'));
});

app.get('/getemptypes/', function (req, res) {

    var sqlsel = 'select * from employeetypes';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.get('/getcustrewards/', function (req, res) {

    var sqlsel = 'select * from customerrewards';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
// --^*v
app.get('/getemp/', function (req, res) {
    var eid = req.query.employeeid;
    var ename = req.query.employeename;
    var ephone = req.query.employeephone;
    var eemail = req.query.employeeemail;
    var esalary = req.query.employeesalary;
    var emailer = req.query.employeemailer;
    var etype = req.query.employeetype;

    console.log("Mailer: "+ emailer);
    console.log("Type: "+ etype);
    
    if (emailer == 1 || emailer == 0) {
        var maileraddon = ' AND dbemployeemailer = ?';
        var maileraddonvar = emailer;
    } else {
        var maileraddon = ' AND dbemployeemailer LIKE ?';
        var maileraddonvar = '%%';
    }

    if (etype > 0) {
        var typeaddon = ' AND dbemployeetype = ?';
        var typeaddonvar = etype;
    } else {
        var typeaddon = ' AND dbemployeetype LIKE ?';
        var typeaddonvar = '%%';
    }
    
    var sqlsel = 'SELECT employeetable.*, employeetypes.dbemptypename FROM employeetable '
        + 'INNER JOIN employeetypes ON employeetypes.dbemptypeid = employeetable.dbemployeetype '
        + 'WHERE dbemployeeid LIKE ? AND dbemployeename LIKE ? AND dbemployeephone LIKE ? '
        + 'AND dbemployeeemail LIKE ? AND dbemployeesalary LIKE ?' + maileraddon + typeaddon;

    var inserts = ['%' + eid + '%', '%' + ename + '%', '%' + ephone + '%', '%' 
        + eemail + '%', '%' + esalary + '%', maileraddonvar, typeaddonvar];

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getcust/', function (req, res) {
    var cid = req.query.customerid;
    var cname = req.query.customername;
    var caddress = req.query.customeraddress;
    var czip = req.query.customerzip;
    var ccredit = req.query.customercredit;
    var cemail = req.query.customeremail;
    var crewards = req.query.customerrewards;
    var cclub = req.query.customerclub;

    console.log("Club: "+ cclub);
    console.log("Rewards: "+ crewards);
    
    if (cclub == 1 || cclub == 0) {
        var clubaddon = ' AND dbcustomerclub = ?';
        var clubaddonvar = cclub;
    } else {
        var clubaddon = ' AND dbcustomerclub LIKE ?';
        var clubaddonvar = '%%';
    }

    if (crewards > 0) {
        var rewardsaddon = ' AND dbcustomerreward = ?';
        var rewardsaddonvar = crewards;
    } else {
        var rewardsaddon = ' AND dbcustomerreward LIKE ?';
        var rewardsaddonvar = '%%';
    }

    var sqlsel = 'Select customertable.*, customerrewards.dbcustrewardsname FROM customertable '
    + 'INNER JOIN customerrewards ON customerrewards.dbcustrewardsid = customertable.dbcustomerreward '
    + 'where dbcustomerid Like ? and dbcustomername Like ? and dbcustomeraddress Like ? '
    + 'and dbcustomerzip Like ? and dbcustomercredit Like ? and dbcustomeremail Like ?' + clubaddon + rewardsaddon;
    
    var inserts = ['%' + cid + '%', '%' + cname + '%', '%' + caddress + '%', '%' 
    + czip + '%', '%' + ccredit + '%', '%' + cemail + '%', clubaddonvar, rewardsaddonvar];

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
// --*^
app.post('/customer', function (req, res, ) {

    var cname = req.body.customername;
    var caddress = req.body.customeraddress;
    var czip = req.body.customerzip;
    var ccredit = req.body.customercredit;
    var cemail = req.body.customeremail;
    console.log(cname);

    var sqlins = "INSERT INTO customertable (dbcustomername, dbcustomeraddress, dbcustomerzip, "
        + " dbcustomercredit, dbcustomeremail) VALUES (?, ?, ?, ?, ?)";
    var inserts = [cname, caddress, czip, ccredit, cemail];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('insertcustomer.html');
        res.end();
    });
});

app.post('/employee', function (req, res, ) {

    var eid = req.body.employeeid;
    var ename = req.body.employeename;
    var eemail = req.body.employeeemail;
    var eaddress = req.body.employeeaddress;
    var esalary = req.body.employeesalary;
    console.log(ename);

    var sqlins = "INSERT INTO employeetable (dbemployeeid, dbemployeename, dbemployeeemail, "
        + " dbemployeeaddress, dbemployeesalary) VALUES (?, ?, ?, ?, ?)";
    var inserts = [eid, ename, eemail, eaddress, esalary];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('insertemployee.html');
        res.end();
    });
});
app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});