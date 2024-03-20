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
  database: "sshell18_cpt262_fall2024_final",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!!");
});

app.set("port", process.env.PORT || 3000);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

/* 

  Search Page GET API calls

*/

// Search Products
app.get("/getproduct/", function (req, res) {
  var pid = req.query.productid;
  var pname = req.query.productname;
  var pprice = req.query.productprice;
  var pquantity = req.query.productquantity;

  var sqlsel =
    "SELECT * " +
    "FROM Products " +
    "WHERE dbproduct_id LIKE ? AND dbproduct_name LIKE ? AND dbproduct_price LIKE ? " +
    "AND dbproduct_quantity LIKE ? ";

  var inserts = [
    "%" + pid + "%",
    "%" + pname + "%",
    "%" + pprice + "%",
    "%" + pquantity + "%",
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
// Search Reservations
app.get("/getreservation/", function (req, res) {
  var rid = req.query.reservationid;
  var rdatetime = req.query.reservationdatetime;
  var rplayer = req.query.reservationplayer;
  var ruser = req.query.reservationuser;

  var sqlsel =
    "SELECT `dbreservation_id`, `dbreservation_datetime`, `dbplayer_email`, " +
    "`dbuser_firstname` FROM `Reservations` AS r INNER JOIN `Players` AS p ON " +
    "r.dbplayer_id=p.dbplayer_id LEFT JOIN `Users` AS u ON r.dbuser_id=u.dbuser_id " +
    "WHERE dbreservation_id LIKE ? AND dbreservation_datetime LIKE ? AND dbplayer_email LIKE ? " +
    "AND dbuser_firstname LIKE ? ";

  var inserts = [
    "%" + rid + "%",
    "%" + rdatetime + "%",
    "%" + rplayer + "%",
    "%" + ruser + "%",
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

/* 

  Insert Page GET Data API calls

*/

// Insert Reservations - Player Data
app.get("/getplrdata/", function (req, res) {
  var sqlsel =
    "SELECT * FROM Players ORDER BY dbplayer_lastname, dbplayer_firstname";
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});
// Insert Reservations - User Data
app.get("/getusrdata/", function (req, res) {
  var sqlsel = "SELECT * FROM Users ORDER BY dbuser_lastname, dbuser_firstname";
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});

/* 

  Insert Page POST API calls

*/

// Insert Reservations
app.post("/reservation/", function (req, res) {
  var rdate = req.body.reservationdate;
  var rtime = req.body.reservationtime;
  var pid = req.body.playerid;
  var uid = req.body.userid;

  var sqlins =
    "INSERT INTO Reservations (dbreservation_datetime, dbplayer_id, dbuser_id) VALUES (?, ?, ?)";
  var rdatetime = rdate + " " + rtime;
  var inserts = [rdatetime, parseInt(pid), parseInt(uid)];

  var sql = mysql.format(sqlins, inserts);

  console.log(sql);

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect("insertreservations.html");
    res.end();
  });
});

app.listen(app.get("port"), function () {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});
