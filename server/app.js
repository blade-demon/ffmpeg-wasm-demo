const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.static("public"));

app.listen(port, () => {
  console.log("App is listening on port " + port);
});
