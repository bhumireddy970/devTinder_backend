const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  res.send({ firstname: "Saradhi", lastname: "Bhumireddy" });
});
app.post("/user", (req, res) => {
  res.send("Data has been posted");
});
app.delete("/user", (req, res) => {
  res.send("Data has been deleted ");
});

app.use("/test", (req, res) => {
  res.send("test path has called");
});

app.listen(3000, () => {
  console.log("Server has started");
});
