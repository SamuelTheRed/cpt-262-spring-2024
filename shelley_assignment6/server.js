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
  var cid = req.body.courseid;
  var csemester = req.body.coursesemester;
  var cyear = req.body.courseyear;
  var facultyid = req.body.facultyid;

  var checkid = "SELECT * from epiccourses where courseid = " + cid;

  var sql = mysql.format(checkid);

  con.query(sql, function (err, data) {
    if (err) throw err;

    if (data.length > 0) {
      console.log(data[0]["courseid"]);

      var sqlins =
        "INSERT INTO epicschedule (schedulesemester, scheduleyear, facultyID, " +
        " courseID) VALUES (?, ?, ?, ?)";
      var inserts = [csemester, cyear, facultyid, cid];

      var sql = mysql.format(sqlins, inserts);

      console.log(sql);

      con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect("insertcourse.html");
        res.end();
      });
    } else {
      console.log("Course ID Does Not Exist");
    }
  });
});

app.get("/getfac/", function (req, res) {
  var sqlsel = "select * from epicfaculty";
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.get("/getdata/", function (req, res) {
  var sqlsel = "SELECT * FROM epiccourses AS c LEFT JOIN epicschedule AS s ON c.courseid = s.courseID " +
    " RIGHT JOIN epicfaculty AS f ON s.facultyID = f.facultyid";
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
