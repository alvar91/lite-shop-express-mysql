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
    if (error) {
      console.error(error);
      throw err;
    }
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
