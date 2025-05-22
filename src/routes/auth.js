const express = require("express");
const User = require("../models/user");
const { validatingUser } = require("../utils/validation");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validatingUser(req);
    const {
      firstName,
      lastName,
      emailId,
      password,
      gender,
      age,
      skills,
      aboutMe,
      profilePicture,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      age,
      skills,
      aboutMe,
      profilePicture,
    });
    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(400).send("Error saving user " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ emailId: email });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    const isMatch = await user.validateUser(password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    const token = await user.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    res.status(200).send(user);
  } catch (err) {
    res.status(400).send("Error logging in " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logged out successfully");
});

module.exports = authRouter;
