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

app.listen(app.get("port"), function () {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});
