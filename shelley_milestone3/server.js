'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');

const mysql = require('mysql2');

// const con = mysql.createConnection({
//     host: "istwebclass.org",
//     user: "sshell18_cpt262remote",
//     password: "f3b6b5eb-7238-4f07-aaa6-d49848d2ec7c",
//     database: "sshell18_Spring2024",
// });

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!!");
// });

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/public/backend/index.html"));
});

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/backend/insertorder.html');
});
