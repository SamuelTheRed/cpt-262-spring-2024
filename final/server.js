'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt'); 

const mysql = require('mysql2'); 

const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "sshell18_cpt262remote",
    password: "f3b6b5eb-7238-4f07-aaa6-d49848d2ec7c",
    database: "sshell18_cpt262final"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login/', function (req, res) {
    var uemail = req.body.useremail;
    var upw = req.body.userpw;

    var sqlsel = 'select * from usertable where dbuseremail = ?';

    var inserts = [uemail];

    var sql = mysql.format(sqlsel, inserts);
    console.log("SQL: " + sql);
    con.query(sql, function (err, data) {
        if (data.length > 0) {
            console.log("User Name Correct:");
            console.log(data[0].dbuserpassword);
            bcrypt.compare(epw, data[0].dbuserpassword, function (err, passwordCorrect) {
                if (err) {
                    throw err
                } else if (!passwordCorrect) {
                    console.log("Password incorrect");
                } else {
                    console.log("Password correct");
                    res.send({ redirect: '../admin/' });
                }
            })
        } else {
            console.log("Incorrect user name or password");
        }
    });
});

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});