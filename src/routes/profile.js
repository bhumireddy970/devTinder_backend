const express = require("express");
const profileRouter = express.Router();
const authUser = require("../middleware/auth");
const { validateEditProfile } = require("../utils/validation");

profileRouter.get("/profile/view", authUser, async (req, res) => {
  const user = req.user;
  res.send(user);
});

profileRouter.patch("/profile/update", authUser, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("This fields are not allowed to be updated");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    res.status(200).send("Profile Updated Successfully");
  } catch (err) {
    return res.status(400).send({ Error: err.message });
  }
});

module.exports = profileRouter;
