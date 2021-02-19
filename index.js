const express = require("express");
const cors = require("cors");
const route = require("./route.js");

const main = () => {
  const app = express();
  const port = process.env.PORT || 8080;

  app.use(cors());
  app.use(express.json());
  app.use("/api", route);
  app.use(express.static("frontend/build"));

  const server = app.listen(port, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
};

main();
