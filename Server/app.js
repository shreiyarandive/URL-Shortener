const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const app = express();
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get("/getUrls", async (req, res, next) => {
  try {
    const url = await ShortUrl.find();
    if (url.length < 1) {
      res.status(401).json({
        error: "No Data",
      });
    } else {
      res.status(200).json(url);
    }
  } catch (err) {
    console.log("err", err);
  }
});

app.get("/:shortUrl", async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) {
      res.status(404).json({
        error: "No data",
      });
    }
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full);
  } catch (err) {
    console.log("err", err);
  }
});
app.post("/shortUrls", async (req, res) => {
  try {
    const shortUrl = new ShortUrl({
      full: req.body.url,
    });
    await shortUrl.save();
    res.status(200).json({
      message: "Done",
    });
  } catch (err) {
    console.log("err", err);
  }
});
module.exports = app;
