let express = require("express");
let app = express();

app.use(express.static("public"));

app.set("view engine", "pug");

let mysql = require("mysql");

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "market",
});

app.listen(3000, function () {
  console.log("node express work on 3000");
});

app.get("/", function (req, res) {
  con.query("SELECT * FROM goods", function (error, result) {
    if (error) throw err;
    let goods = {};
    for (let i = 0; i < result.length; i++) {
      goods[result[i]["id"]] = result[i];
    }
    console.log(JSON.parse(JSON.stringify(goods)));
    res.render("main", {
      goods: JSON.parse(JSON.stringify(goods)),
    });
  });
});

app.get("/cat", function (req, res) {
  console.log(req.query.id);
  let catId = req.query.id;

  let cat = new Promise(function (resolve, reject) {
    con.query("SELECT * FROM category WHERE id=" + catId, function (
      error,
      result
    ) {
      if (error) reject(err);
      resolve(result);
    });
  });
  let goods = new Promise(function (resolve, reject) {
    con.query("SELECT * FROM goods WHERE category=" + catId, function (
      error,
      result
    ) {
      if (error) reject(err);
      resolve(result);
    });
  });

  Promise.all([cat, goods]).then(function (value) {
    console.log(value[0]);
    res.render("cat", {
      cat: JSON.parse(JSON.stringify(value[0])),
      goods: JSON.parse(JSON.stringify(value[1])),
    });
  });
});
