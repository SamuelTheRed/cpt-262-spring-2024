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
  var pid = req.query.productidSS;
  var pname = req.query.productnameSS;
  var pprice = req.query.productpriceSS;
  var pquantity = req.query.productquantitySS;

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
  var rid = req.query.reservationidSS;
  var rdatetime = req.query.reservationdatetimeSS;
  var rplayer = req.query.reservationplayerSS;
  var ruser = req.query.reservationuserSS;

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

// Insert Reservations, Insert Orders - Player Data
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
// Insert Reservations, Insert Orders - User Data
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
// Insert Orders, Insert Purchase - Order Data
app.get("/getorddata/", function (req, res) {
  var sqlsel =
    "SELECT * FROM Orders AS o INNER JOIN Players AS p ON o.dbplayer_id=p.dbplayer_id ORDER BY dborder_datetime";
  var sql = mysql.format(sqlsel);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.send(JSON.stringify(data));
  });
});
// Insert Orders - Product Data
app.get("/getpdcdata/", function (req, res) {
  var sqlsel = "SELECT * FROM Products ORDER BY dbproduct_id";
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
  var rdate = req.body.reservationdateSS;
  var rtime = req.body.reservationtimeSS;
  var pid = req.body.playeridSS;
  var uid = req.body.useridSS;

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
// Insert Orders
app.post("/order/", function (req, res) {
  var odate = req.body.orderdateSS;
  var otime = req.body.ordertimeSS;
  var pid = req.body.playeridSS;
  var uid = req.body.useridSS;

  var sqlins =
    "INSERT INTO Orders (dborder_datetime, dbplayer_id, dbuser_id) VALUES (?, ?, ?)";
  var odatetime = odate + " " + otime;
  var inserts = [odatetime, parseInt(pid), parseInt(uid)];

  var sql = mysql.format(sqlins, inserts);

  console.log(sql);

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect("insertorder.html");
    res.end();
  });
});
// Insert Order Items
app.post("/orderitem/", function (req, res) {
  var oid = req.body.orderidSS;
  var pid = req.body.productidSS;
  var iquantity = req.body.itemquantitySS;

  var sqlins =
    "INSERT INTO OrderItems (dborder_id, dbproduct_id, dborderitem_quantity) VALUES (?, ?, ?)";
  var inserts = [parseInt(oid), parseInt(pid), parseInt(iquantity)];

  var sql = mysql.format(sqlins, inserts);

  console.log(sql);

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect("insertorder.html");
    res.end();
  });
});
// Insert Players
app.post("/player", function (req, res) {
  var plastname = req.body.playerlastnameSS;
  var pfirstname = req.body.playerfirstnameSS;
  var pemail = req.body.playeremailSS;
  var pphone = req.body.playerphoneSS;
  var prewards = req.body.playerrewardsSS;
  var ppw = req.body.playerpwSS;

  console.log("pw" + ppw);

  var saltRounds = 10;
  var theHashedPW = "";
  bcrypt.hash(ppw, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.log("Bad");
      return;
    } else {
      theHashedPW = hashedPassword;
      console.log("Password 1: " + theHashedPW);
    }

    var sqlins =
      "INSERT INTO Players (dbplayer_firstname, dbplayer_lastname, dbplayer_email, " +
      " dbplayer_phone, dbplayer_rewardstier, dbplayer_password) VALUES (?, ?, ?, ?, ?, ?)";
    var inserts = [
      pfirstname,
      plastname,
      pemail,
      pphone,
      prewards,
      theHashedPW,
    ];

    var sql = mysql.format(sqlins, inserts);

    console.log(sql);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect("insertplayers.html");
        res.end();
    });
  });
});
// Insert Products
app.post("/product/", function (req, res) {
  var pnameSS = req.body.productnameSS;
  var pdescriptionSS = req.body.productdescriptionSS;
  var ppriceSS = req.body.productpriceSS;
  var pquantitySS = req.body.productquantitySS;

  var sqlins =
    "INSERT INTO Products (dbproduct_name, dbproduct_description, dbproduct_price, dbproduct_quantity) VALUES (?, ?, ?, ?)";
  var inserts = [pnameSS, pdescriptionSS, ppriceSS, pquantitySS];

  var sql = mysql.format(sqlins, inserts);

  console.log(sql);

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect("insertproduct.html");
    res.end();
  });
});
//Insert Purchases
app.post("/purchase/", function (req, res) {
  var pdate = req.body.purchasedateSS;
  var ptime = req.body.purchasetimeSS;
  var oid = req.body.orderidSS;
  var pstatus = req.body.purchaseinformationSS;

  var sqlins =
    "INSERT INTO Purchases (dbpurchase_datetimefulfilled, dborder_id, dbpurchase_status) VALUES (?, ?, ?)";
  var pdatetime = pdate + " " + ptime;
  var inserts = [pdatetime, parseInt(oid), pstatus];

  var sql = mysql.format(sqlins, inserts);

  console.log(sql);

  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.redirect("insertpurchase.html");
    res.end();
  });
});
// Insert Users
app.post("/user", function (req, res) {
  var ulastname = req.body.userlastnameSS;
  var ufirstname = req.body.userfirstnameSS;
  var uemail = req.body.useremailSS;
  var uphone = req.body.userphoneSS;
  var urole = req.body.userroleSS;
  var upw = req.body.userpwSS;

  console.log("pw" + upw);

  var saltRounds = 10;
  var theHashedPW = "";
  bcrypt.hash(upw, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.log("Bad");
      return;
    } else {
      theHashedPW = hashedPassword;
      console.log("Password 1: " + theHashedPW);
    }

    var sqlins =
      "INSERT INTO Users (dbuser_lastname, dbuser_firstname, dbuser_email, " +
      " dbuser_phone, dbuser_role, dbuser_password) VALUES (?, ?, ?, ?, ?, ?)";
    var inserts = [
      ulastname,
      ufirstname,
      uemail,
      uphone,
      urole,
      theHashedPW,
    ];

    var sql = mysql.format(sqlins, inserts);

    console.log(sql);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect("insertusers.html");
        res.end();
    });
  });
});

/* 

  Miscellaneous POST API calls

*/

// Login User
app.post("/loginusr/", function (req, res) {
  var uemail = req.body.useremailSS;
  var upw = req.body.userpwSS;
  console.log(upw);

  var sqlsel = "select * from Users where dbuser_email = ?";

  var inserts = [uemail];

  var sql = mysql.format(sqlsel, inserts);
  console.log("SQL: " + sql);
  con.query(sql, function (err, data) {
      if (data.length > 0) {
          bcrypt.compare(
              upw,
              data[0].dbuser_password,
              function (err, passwordCorrect) {
                  if (err) {
                      throw err;
                  } else if (!passwordCorrect) {
                      console.log("Password incorrect");
                  } else {
                      console.log("Password correct");
                      res.send({ redirect: "insertorder.html" });
                  }
              }
          );
      } else {
          console.log("Incorrect user name or password");
      }
  });
});

app.listen(app.get("port"), function () {
  console.log("Server started: http://localhost:" + app.get("port") + "/");
});
