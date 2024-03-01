"use strict";
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "istwebclass.org",
  user: "sshell18_cpt262remote",
  password: "f3b6b5eb-7238-4f07-aaa6-d49848d2ec7c",
  database: "sshell18_epic262_epic",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.set("port", process.env.PORT || 3000);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.post("/faculty/", function (req, res) {
  var ftitle = req.body.facultytitle;
  var ffirstname = req.body.facultyfirstname;
  var flastname = req.body.facultylastname;
  var femail = req.body.facultyemail;

  var sqlins =
    "INSERT INTO epicfaculty (facultytitle, facultyfirstname, facultylastname, " +
    " facultyemail) VALUES (?, ?, ?, ?)";
  var inserts = [ftitle, ffirstname, flastname, femail];

  var sql = mysql.format(sqlins, inserts);

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect("insertfaculty.html");
    res.end();
  });
});

app.post("/course/", function (req, res) {
  var cprefix = req.body.courseprefix;
  var cnumber = req.body.coursenumber;
  var csection = req.body.coursesection;
  var cassignment = req.body.courseassignment

  var sqlins =
    "INSERT INTO epiccourses (courseprefix, coursenumber, coursesection, courseassignment) VALUES (?, ?, ?, ?)";
  var inserts = [cprefix, cnumber, csection, cassignment];

  var sql = mysql.format(sqlins, inserts);

  console.log(sql);

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect("insertcourse.html");
    res.end();
  });
});

app.post("/schedule/", function (req, res) {
  var cid = req.body.courseid;
  var ssemester = req.body.schedulesemester;
  var syear = req.body.scheduleyear;
  var fid = req.body.facultyid;

  var sqlins =
    "INSERT INTO epicschedule (schedulesemester, scheduleyear, facultyID, courseID) VALUES (?, ?, ?, ?)";
  var inserts = [ssemester, syear, parseInt(fid), parseInt(cid)];

  var sql = mysql.format(sqlins, inserts);

  console.log(sql);

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect("insertschedule.html");
    res.end();
  });
});

app.get("/getfacdata/", function (req, res) {
  var sqlsel = "SELECT * FROM epicfaculty ORDER BY facultylastname, facultyfirstname";
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});
app.get("/getcrsdata/", function (req, res) {
  var sqlsel = "SELECT * FROM epiccourses ORDER BY courseprefix, coursenumber, coursesection";
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.post("/getcourses/", function (req, res) {
  var sqlsel = "SELECT * FROM epiccourses AS c INNER JOIN epicschedule AS s ON c.courseid=s.courseID ORDER BY courseprefix, coursenumber, coursesection";
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.listen(app.get("port"), function () {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});
