"use strict";
var fs = require("fs");
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const jwtKey = "key_b9uu2_pW38x";
const jwtExpirySeconds = 3000;

const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "istwebclass.org",
  user: "sshell18_cpt262remote",
  password: "f3b6b5eb-7238-4f07-aaa6-d49848d2ec7c",
  database: "sshell18_cpt262_fall2024_final",
  dateStrings: true,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!!");
});

app.set("port", process.env.PORT || 3000);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

/* 

  Search Page GET API calls

*/

// Search Order
app.get("/getorder/", function (req, res) {
  var oid = req.query.orderidSS;
  console.log("id4: " + oid);
  var odatetime = req.query.orderdatetimeSS;
  var oplayer = req.query.orderplayerSS;
  var ouser = req.query.orderuserSS;

  var sqlsel =
    "SELECT `dborder_id`, `dborder_datetime`, `dbplayer_lastname`, " +
    "`dbuser_firstname` FROM `Orders` AS o INNER JOIN `Players` AS p ON " +
    "o.dbplayer_id=p.dbplayer_id LEFT JOIN `Users` AS u ON o.dbuser_id=u.dbuser_id " +
    "WHERE dborder_id LIKE ? AND dborder_datetime LIKE ? AND dbplayer_lastname LIKE ? " +
    "AND dbuser_firstname LIKE ? ";

  var inserts = [
    "%" + oid + "%",
    "%" + odatetime + "%",
    "%" + oplayer + "%",
    "%" + ouser + "%",
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
// Search Order Item
app.get("/getorderitem/", function (req, res) {
  var oiid = req.query.orderitemidSS;
  var oiproduct = req.query.orderitemproductSS;
  var oiorder = req.query.orderitemorderSS;
  var oiquantity = req.query.orderitemquantitySS;

  var sqlsel =
    "SELECT * FROM `OrderItems` AS i INNER JOIN `Products` AS p ON " +
    "i.dbproduct_id=p.dbproduct_id LEFT JOIN `Orders` AS o ON i.dborder_id=o.dborder_id " +
    "WHERE dborderitem_id LIKE ? AND dbproduct_name LIKE ? AND o.dborder_id LIKE ? " +
    "AND dborderitem_quantity LIKE ? ";

  var inserts = [
    "%" + oiid + "%",
    "%" + oiproduct + "%",
    "%" + oiorder + "%",
    "%" + oiquantity + "%",
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
// Search  Players
app.get("/getplayer/", function (req, res) {
  var pid = req.query.playeridSS;
  var pfirstname = req.query.playerfirstnameSS;
  var plastname = req.query.playerlastnameSS;
  var pemail = req.query.playeremailSS;
  var pphone = req.query.playerphoneSS;
  var prewards = req.query.playerrewardsSS;

  var sqlsel =
    "SELECT * FROM `Players` " +
    "WHERE dbplayer_id LIKE ? AND dbplayer_firstname LIKE ? AND dbplayer_lastname LIKE ? " +
    "AND dbplayer_email LIKE ? AND dbplayer_phone LIKE ? AND dbplayer_rewardstier LIKE ? ";

  var inserts = [
    "%" + pid + "%",
    "%" + pfirstname + "%",
    "%" + plastname + "%",
    "%" + pemail + "%",
    "%" + pphone + "%",
    "%" + prewards + "%",
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
// Search Purchases
app.get("/getpurchase/", function (req, res) {
  var pid = req.query.purchaseidSS;
  var pstatus = req.query.purchaseinformationSS;
  var pdatetime = req.query.purchasedatetimeSS;

  var sqlsel =
    "SELECT * FROM `Purchases` " +
    "WHERE dborder_id LIKE ? AND dbpurchase_status LIKE ? AND dbpurchase_datetimefulfilled LIKE ?";

  var inserts = ["%" + pid + "%", "%" + pstatus + "%", "%" + pdatetime + "%"];

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
    "AND dbuser_firstname LIKE ? ORDER BY dbreservation_datetime DESC";

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
// Search  Users
app.get("/getuser/", function (req, res) {
  var uid = req.query.useridSS;
  var ufirstname = req.query.userfirstnameSS;
  var ulastname = req.query.userlastnameSS;
  var uemail = req.query.useremailSS;
  var uphone = req.query.userphoneSS;
  var urole = req.query.userroleSS;

  var sqlsel =
    "SELECT * FROM `Users` " +
    "WHERE dbuser_id LIKE ? AND dbuser_firstname LIKE ? AND dbuser_lastname LIKE ? " +
    "AND dbuser_email LIKE ? AND dbuser_phone LIKE ? AND dbuser_role LIKE ? ";

  var inserts = [
    "%" + uid + "%",
    "%" + ufirstname + "%",
    "%" + ulastname + "%",
    "%" + uemail + "%",
    "%" + uphone + "%",
    "%" + urole + "%",
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
  var sqlsel =
    "SELECT * FROM Users WHERE dbuser_id > 0 ORDER BY dbuser_lastname, dbuser_firstname"; // Update to not include self reservation
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
      console.log("Invalid Password Process");
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
// Insert Reservations Front End
app.post("/reservation-frontend/", function (req, res) {
  var rdate = req.body.reservationdateSS;
  var rtime = req.body.reservationtimeSS;
  var pemail = req.body.playeremailSS;
  var ppw = req.body.playerpwSS;
  var uid = 0;


  var sqlsel = "select * from Players where dbplayer_email = ?";
  var inserts = [pemail];

  var sql = mysql.format(sqlsel, inserts);
  console.log("SQL: " + sql);
  con.query(sql, function (err, data) {
    if (data.length > 0) {
      var plrkey = data[0].dbplayer_id;

      bcrypt.compare(
        ppw,
        data[0].dbplayer_password,
        function (err, passwordCorrect) {
          if (err) {
            throw err;
          } else if (!passwordCorrect) {
            console.log("Password incorrect");
          } else {
            console.log("Password correct");
            // Create token specific to player
            const token = jwt.sign({ plrkey }, jwtKey, {
              algorithm: "HS256",
              expiresIn: jwtExpirySeconds,
            });
            // Add cookie to user for page viewing validation
            res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });

            var sqlins =
              "INSERT INTO Reservations (dbreservation_datetime, dbplayer_id, dbuser_id) VALUES (?, ?, ?)";
            var rdatetime = rdate + " " + rtime;
            var inserts = [rdatetime, plrkey, parseInt(uid)];

            var sql = mysql.format(sqlins, inserts);

            console.log(sql);

            con.execute(sql, function (err, result) {
              if (err) throw err;
              console.log("1 record inserted");
              res.redirect("insertreservations.html");
              res.end();
            });
          }
        }
      );
    } else {
      console.log("Incorrect user name or password");
    }
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
    var inserts = [ulastname, ufirstname, uemail, uphone, urole, theHashedPW];

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

  Update Page GET API Calls

*/
// Get Single Orders
app.get("/getsingleord/", function (req, res) {
  var okey = req.query.upordkeySS;

  var sqlsel = "select * from Orders where dborder_id = ?";
  var inserts = [okey];

  var sql = mysql.format(sqlsel, inserts);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});
// Get Single Order Items
app.get("/getsingleorditm/", function (req, res) {
  var oikey = req.query.uporditmidSS;

  var sqlsel = "select * from OrderItems where dborderitem_id = ?";
  var inserts = [oikey];

  var sql = mysql.format(sqlsel, inserts);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});
// Get Single Player
app.get("/getsingleplr/", function (req, res) {
  var pid = req.query.upplridSS;

  var sqlsel = "select * from Players where dbplayer_id = ?";
  var inserts = [pid];

  var sql = mysql.format(sqlsel, inserts);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});
// Get Single Product
app.get("/getsinglepdc/", function (req, res) {
  var pid = req.query.uppdcidSS;

  var sqlsel = "select * from Products where dbproduct_id = ?";
  var inserts = [pid];

  var sql = mysql.format(sqlsel, inserts);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});
// Get Single Purchase
app.get("/getsinglepur/", function (req, res) {
  var pid = req.query.uppuridSS;

  var sqlsel = "select * from Purchases where dborder_id = ?";
  var inserts = [pid];

  var sql = mysql.format(sqlsel, inserts);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});
// Get Single Reservation
app.get("/getsingleres/", function (req, res) {
  var rid = req.query.upresidSS;

  var sqlsel = "select * from Reservations where dbreservation_id = ?";
  var inserts = [rid];

  var sql = mysql.format(sqlsel, inserts);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});
// Get Single User
app.get("/getsingleusr/", function (req, res) {
  var uid = req.query.upusridSS;

  var sqlsel = "select * from Users where dbuser_id = ?";
  var inserts = [uid];

  var sql = mysql.format(sqlsel, inserts);

  con.query(sql, function (err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    res.send(JSON.stringify(data));
  });
});

/* 

  Update Page POST API Calls

*/

// Update Single Order Item
app.post("/updatesingleord", function (req, res) {
  var oiid = req.body.uporderitemidSS;
  var pid = req.body.uporderitemproductSS;
  var oid = req.body.uporderitemorderSS;
  var oiquantity = req.body.uporderitemquantitySS;

  var sqlins =
    "UPDATE OrderItems SET dborderitem_id = ?, dbproduct_id = ?, " +
    " dborder_id = ?, dborderitem_quantity = ? " +
    " WHERE dborderitem_id = ? ";
  var inserts = [oiid, pid, oid, oiquantity, oiid];

  var sql = mysql.format(sqlins, inserts);
  console.log(sql);
  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");

    res.end();
  });
});
// Update Single Player
app.post("/updatesingleplr", function (req, res) {
  var pid = req.body.upplayeridSS;
  var pfirstname = req.body.upplayerfirstnameSS;
  var plastname = req.body.upplayerlastnameSS;
  var pphone = req.body.upplayerphoneSS;
  var pemail = req.body.upplayeremailSS;
  var prewards = req.body.upplayerrewardsSS;

  var sqlins =
    "UPDATE Players SET dbplayer_id = ?, dbplayer_firstname = ?, dbplayer_lastname = ?, dbplayer_email = ?, " +
    " dbplayer_phone = ?, dbplayer_rewardstier = ? " +
    " WHERE dbplayer_id = ? ";
  var inserts = [pid, pfirstname, plastname, pemail, pphone, prewards, pid];

  var sql = mysql.format(sqlins, inserts);
  console.log(sql);
  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");

    res.end();
  });
});
// Update Single Product
app.post("/updatesinglepdc", function (req, res) {
  var pid = req.body.upproductidSS;
  var pname = req.body.upproductnameSS;
  var pdescription = req.body.upproductdescriptionSS;
  var pprice = req.body.upproductpriceSS;
  var pquantity = req.body.upproductquantitySS;

  var sqlins =
    "UPDATE Products SET dbproduct_id = ?, dbproduct_name = ?, dbproduct_description = ?, " +
    " dbproduct_price = ?, dbproduct_quantity = ? " +
    " WHERE dbproduct_id = ? ";
  var inserts = [pid, pname, pdescription, pprice, pquantity, pid];

  var sql = mysql.format(sqlins, inserts);
  console.log(sql);
  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");

    res.end();
  });
});
// Update Single Purchase
app.post("/updatesinglepur", function (req, res) {
  var pid = req.body.uppurchaseidSS;
  var pstatus = req.body.uppurchasestatusSS;
  var pdatetime = req.body.uppurchasedatetimeSS;

  var sqlins =
    "UPDATE Purchases SET dborder_id = ?, dbpurchase_status = ?, dbpurchase_datetimefulfilled = ? " +
    " WHERE dborder_id = ? ";
  var inserts = [pid, pstatus, pdatetime, pid];

  var sql = mysql.format(sqlins, inserts);
  console.log(sql);
  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");

    res.end();
  });
});
// Update Single User
app.post("/updatesingleusr", function (req, res) {
  var uid = req.body.upuseridSS;
  var ufirstname = req.body.upuserfirstnameSS;
  var ulastname = req.body.upuserlastnameSS;
  var uphone = req.body.upuserphoneSS;
  var uemail = req.body.upuseremailSS;
  var urole = req.body.upuserroleSS;

  var sqlins =
    "UPDATE Users SET dbuser_id = ?, dbuser_firstname = ?, dbuser_lastname = ?, dbuser_email = ?, " +
    " dbuser_phone = ?, dbuser_role = ? " +
    " WHERE dbuser_id = ? ";
  var inserts = [uid, ufirstname, ulastname, uemail, uphone, urole, uid];

  var sql = mysql.format(sqlins, inserts);
  console.log(sql);
  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");

    res.end();
  });
});
// Update Single Reservation
app.post("/updatesingleres", function (req, res) {
  var rid = req.body.upreservationidSS;
  var ruser = req.body.upreservationuserSS;
  var rdatetime = req.body.upreservationdatetimeSS;
  var rplayer = req.body.upreservationplayerSS;

  var sqlins =
    "UPDATE Reservations SET dbreservation_id = ?, dbreservation_datetime = ?, dbuser_id = ?, dbplayer_id = ? " +
    " WHERE dbreservation_id = ? ";
  var inserts = [rid, rdatetime, ruser, rplayer, rid];

  var sql = mysql.format(sqlins, inserts);
  console.log(sql);
  con.execute(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");

    res.end();
  });
});

/* 

  Miscellaneous GET API calls

*/

// Get if Logged Out
app.get("/getloggedout/", function (req, res) {
  res.cookie("token", 2, { maxAge: 0 });
  res.send({ redirect: "/backend/index.html" });
});
// Get if Logged In
app.get("/getloggedin/", function (req, res) {
  var viewpage = "";
  var datahold = [];
  const validtoken = req.cookies.token;
  console.log("token new:", validtoken);
  var payload;

  if (!validtoken) {
    viewpage = "";
    console.log("NVT");
  } else {
    try {
      payload = jwt.verify(validtoken, jwtKey);
      console.log("payload new:", payload.usrkey);
      viewpage = payload.usrkey;

      var sqlsel = "select * from Users where dbuser_role = ?";
      var inserts = [viewpage];

      var sql = mysql.format(sqlsel, inserts);

      con.query(sql, function (err, data) {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        console.log("Show 1" + data);

        datahold = data;

        res.send(JSON.stringify(data));
      });
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        viewpage = 0;
        console.log("NVT2");
      }
      viewpage = 0;
      console.log("NVT3");
    }
  }
});

/* 

  Miscellaneous POST API calls

*/

// Login User
app.post("/loginusr/", function (req, res) {
  var uemail = req.body.useremailSS;
  var upw = req.body.userpwSS;

  var sqlsel = "select * from Users where dbuser_email = ?";
  var inserts = [uemail];

  var sql = mysql.format(sqlsel, inserts);
  console.log("SQL: " + sql);
  con.query(sql, function (err, data) {
    if (data.length > 0) {
      var usrkey = data[0].dbuser_role;

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
            // Create token specific to user
            const token = jwt.sign({ usrkey }, jwtKey, {
              algorithm: "HS256",
              expiresIn: jwtExpirySeconds,
            });
            // Add cookie to user for page viewing validation
            res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
            res.send({ redirect: "searchorder.html" });
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
