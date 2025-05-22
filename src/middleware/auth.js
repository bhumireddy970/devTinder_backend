const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Please login to continue");
    }
    const decodemessage = jwt.verify(token, "Bhumireddy@123");
    const _id = decodemessage.id;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Unauthorized: " + err.message);
  }
};

module.exports = authUser;
