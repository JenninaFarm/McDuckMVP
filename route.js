const express = require("express");
const data = require("./data.js");

const route = express.Router();

route.get("/", async (req, res) => {
  try {
    const result = await data.parseCSV();
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

module.exports = route;
