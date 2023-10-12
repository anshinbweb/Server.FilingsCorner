const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { throws } = require("assert");
// const autoIncrement = require("mongoose-auto-increment");
// const XMLHttpRequest =  require('xhr2');
// var httpRequest = new XMLHttpRequest();
// const cookieParser = require("cookie-parser");
require("dotenv").config();
// const url = process.env.API_URL;
// const cron = require("node-cron");
const axios = require("axios");

global.__basedir = __dirname;

const app = express();
let databasestatus = "In-Progress";
app.use(cors());
app.options("*", cors());
app.use("/uploads", express.static("uploads"));
app.use("/log", express.static("log"));
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE, { useNewUrlParser: true })
  .then(() => {
    databasestatus = "DB connected";
    console.log("DB connected");
  })
  .catch((err) => {
    databasestatus = err;
    console.log("DB Error => ", err);
  });

// autoIncrement.initialize(mongoose.connection);

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("files"));

//routes
// app.use("/api", authRoutes);
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require("./routes/" + r))
);

// app.use("/api", require("./routes/ToDoTask"));

app.get("/api", (req, res) => {
  res.json({
    version: "v1.0-10.12.23.",
    dbstatus: databasestatus,
  });
});

app.get("/error", (req, res) => {
  let num = 20;
  num = 20 / 0;
  // new throws("new test");
  res.test("hit the api button. v-10.12.2023.");
});

app.use(async (err, req, res, next) => {
  let filedata = {
    datetime: new Date(),
    message: err?.message,
    stake: err?.stack,
  };
  try {
    let writecontent = [];
    if (fs.existsSync("log/error.html")) {
      let filedata = fs.readFileSync("log/error.html");
      if (filedata) {
        writecontent = JSON.parse(filedata);
      }
    }
    writecontent.push(filedata);
    fs.writeFileSync(
      "log/error.html",
      JSON.stringify(writecontent),
      function (err) {
        if (err) throw err;
        console.log("Saved!");
      }
    );
  } catch (error) {}

  return res.status(500).json({
    success: false,
    msg: "We are updating",
    data: filedata,
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
