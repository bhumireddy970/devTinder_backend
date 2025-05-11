const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("test path has called");
});
app.use("/", (req, res) => {
  res.send("Base path has called");
});

app.listen(3000, () => {
  console.log("Server has started");
});
