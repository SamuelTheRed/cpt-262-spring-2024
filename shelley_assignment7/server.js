"use strict";
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var bcrypt = require("bcrypt");

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
  var cassignment = req.body.courseassignment;

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

app.post("/results/", function (req, res) {
  var schid = req.body.scheduleid;
  var resslo = req.body.resultslo;
  var resind = req.body.resultindicator;
  var resthr = req.body.resultthree;
  var restwo = req.body.resulttwo;
  var resone = req.body.resultone;

  var sqlins =
    "INSERT INTO epicresults (scheduleID, resultslo, resultindicator, resultthree, resulttwo, resultone) VALUES (?, ?, ?, ?, ?, ?)";
  var inserts = [parseInt(schid), resslo, resind, parseInt(resthr), parseInt(restwo), parseInt(resone)];

  var sql = mysql.format(sqlins, inserts);

  console.log(sql);

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect("insertresults.html");
    res.end();
  });
});

app.get("/getfacdata/", function (req, res) {
  var sqlsel =
    "SELECT * FROM epicfaculty ORDER BY facultylastname, facultyfirstname";
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
  var sqlsel =
    "SELECT * FROM epiccourses ORDER BY courseprefix, coursenumber, coursesection";
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});
app.get("/getschdata/", function (req, res) {
  var sqlsel =
    "SELECT * FROM epicschedule INNER JOIN epiccourses ON epicschedule.courseID=epiccourses.courseid " +
    "INNER JOIN epicfaculty ON epicschedule.facultyID=epicfaculty.facultyid ORDER BY courseprefix, " +
    "coursenumber, coursesection, scheduleyear, schedulesemester, facultylastname";
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

app.get("/getfaculty/", function (req, res) {
  var fid = req.query.facultyid;
  var ftitle = req.query.facultytitle;
  var ffirstname = req.query.facultyfirstname;
  var flastname = req.query.facultylastname;
  var femail = req.query.facultyemail;

  var sqlsel =
    "SELECT * " +
    "FROM epicfaculty " +
    "WHERE facultyid LIKE ? AND facultytitle LIKE ? AND facultyfirstname LIKE ? " +
    "AND facultylastname LIKE ? AND facultyemail LIKE ? ";

  var inserts = [
    "%" + fid + "%",
    "%" + ftitle + "%",
    "%" + ffirstname + "%",
    "%" + flastname + "%",
    "%" + femail + "%",
  ];

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

app.get("/getcourse/", function (req, res) {
  var cid = req.query.courseid;
  var cprefix = req.query.courseprefix;
  var cnumber = req.query.coursenumber;
  var csection = req.query.coursesection;

  var sqlsel =
    "SELECT * " +
    "FROM epiccourses " +
    "WHERE courseid LIKE ? AND courseprefix LIKE ? AND coursenumber LIKE ? " +
    "AND coursesection LIKE ? ";

  var inserts = [
    "%" + cid + "%",
    "%" + cprefix + "%",
    "%" + cnumber + "%",
    "%" + csection + "%",
  ];

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

app.get("/getschedule/", function (req, res) {
  var sid = req.query.scheduleid;
  var cprefix = req.query.courseprefix;
  var cnumber = req.query.coursenumber;
  var csection = req.query.coursesection;
  var ssemester = req.query.schedulesemester;
  var syear = req.query.scheduleyear;
  var faculty = req.query.coursefaculty;

  console.log("faculty: " + faculty);

  var sqlsel =
    "SELECT epicschedule.*, epiccourses.courseprefix, epiccourses.coursenumber, " + 
    "epiccourses.coursesection, epicfaculty.facultyfirstname, epicfaculty.facultylastname " +
    "FROM epicschedule INNER JOIN epiccourses ON epicschedule.courseID=epiccourses.courseid " +
    "INNER JOIN epicfaculty ON epicschedule.facultyID=epicfaculty.facultyid " +
    "WHERE scheduleid LIKE ? AND courseprefix LIKE ? AND coursenumber LIKE ? " +
    "AND coursesection LIKE ? AND schedulesemester LIKE ? AND scheduleyear LIKE ? " +
    "AND epicfaculty.facultylastname LIKE ? ";

  var inserts = [
    "%" + sid + "%",
    "%" + cprefix + "%",
    "%" + cnumber + "%",
    "%" + csection + "%",
    "%" + ssemester + "%",
    "%" + syear + "%",
    "%" + faculty + "%"
  ];

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

app.get("/getresults/", function (req, res) {
  var rid = req.query.resultid;
  var cprefix = req.query.courseprefix;
  var cnumber = req.query.coursenumber;
  var csection = req.query.coursesection;
  var ssemester = req.query.schedulesemester;
  var syear = req.query.scheduleyear;
  var rslo = req.query.resultslo;
  var rindicator = req.query.resultindicator;
  var rthree = req.query.resultthree;
  var rtwo = req.query.resulttwo;
  var rone = req.query.resultone;

  var sqlsel =
    "SELECT epicresults.*, epiccourses.courseprefix, epiccourses.coursenumber, " +
    "epiccourses.coursesection, epicschedule.schedulesemester, epicschedule.scheduleyear " +
    "FROM epicresults INNER JOIN epicschedule ON epicresults.scheduleID=epicschedule.scheduleid " +
    "INNER JOIN epiccourses ON epicschedule.courseID=epiccourses.courseid " +
    "WHERE resultid LIKE ? AND courseprefix LIKE ? AND coursenumber LIKE ? " +
    "AND coursesection LIKE ? AND schedulesemester LIKE ? AND scheduleyear LIKE ? " +
    "AND epicresults.resultslo LIKE ? AND epicresults.resultindicator LIKE ? " +
    "AND epicresults.resultthree LIKE ? AND epicresults.resulttwo LIKE ? " +
    "AND epicresults.resultone LIKE ?";

  var inserts = [
    "%" + rid + "%",
    "%" + cprefix + "%",
    "%" + cnumber + "%",
    "%" + csection + "%",
    "%" + ssemester + "%",
    "%" + syear + "%",
    "%" + rslo + "%",
    "%" + rindicator + "%",
    "%" + rthree + "%",
    "%" + rtwo + "%",
    "%" + rone + "%",
  ];

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


app.listen(app.get("port"), function () {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});
