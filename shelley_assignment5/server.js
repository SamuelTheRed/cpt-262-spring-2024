'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const mysql = require('mysql2'); 

const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "sshell18_cpt262remote",
    password: "f3b6b5eb-7238-4f07-aaa6-d49848d2ec7c",
    database: "sshell18_epic262_epic"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/faculty', function (req, res, ) {

    var ftitle = req.body.facultytitle;
    var ffirstname = req.body.facultyfirstname;
    var flastname = req.body.facultylastname;
    var femail = req.body.facultyemail;
    

    var sqlins = "INSERT INTO epicfaculty (facultytitle, facultyfirstname, facultylastname, "
        + " facultyemail) VALUES (?, ?, ?, ?)";
    var inserts = [ftitle, ffirstname, flastname, femail];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('insertfaculty.html');
        res.end();
    });
});

app.post('/course', function (req, res, ) {

    var cid = req.body.courseid;
    var csemester = req.body.coursesemester;
    var cyear = req.body.courseyear;
    var cfaculty = req.body.coursefaculty;
    var facultyid;

    // Selects object form db where faculty last name eqauls what user entered
    var sqlsel = 'select facultyid from epicfaculty where facultylastname = \'' + cfaculty + '\'';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        console.log("faculty id (first instance): " + JSON.stringify(data[0]["facultyid"]));
        if (data.length > 0) {
            facultyid = JSON.stringify(data[0]["facultyid"]);
        }else{
            console.log("Faculty Does Not Exist");
        }
    });
    // Why does this function print out the memory location and not the value at that location
    // console.log("faculty id (second instance): " + facultyid);

    // This statement goes against all programming logic, but it's jsut a placeholder until I can figure out why these functions are running out of order
    facultyid = "2";

    // TODO: use course information to find course id.

    // I want to use the faculty id but it becomes undefined at a certain point and I don't know why
    var sqlins = "INSERT INTO epicschedule (schedulesemester, scheduleyear, facultyID, "
        + " courseID) VALUES (?, ?, ?, ?)";
    var inserts = [csemester, cyear, facultyid, cid];

    var sql = mysql.format(sqlins, inserts);
    
    console.log(sql);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('insertfaculty.html');
        res.end();
    });
});

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
