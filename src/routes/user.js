const express = require("express");
const ConnectionRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();
const authUser = require("../middleware/auth");
const User = require("../models/user");

userRouter.get("/user/request/recieved", authUser, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserID: loggedUser._id,
      status: "interested",
    }).populate(
      "fromUserID",
      "firstName lastName age gender profilePicture aboutMe"
    );

    res.status(200).json({
      message: "Data fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

userRouter.get("/user/request/connections", authUser, async (req, res) => {
  try {
    const loggedUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { fromUserID: loggedUser._id, status: "accepted" },
        { toUserID: loggedUser._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserID",
        "firstName lastName age gender profilePicture aboutMe"
      )
      .populate(
        "toUserID",
        "firstName lastName age gender profilePicture aboutMe"
      );
    const data = connectionRequest.map((request) => {
      if (request.fromUserID._id.toString() === loggedUser._id.toString()) {
        return request.toUserID;
      }

      return request.fromUserID;
    });
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

userRouter.get("/feed", authUser, async (req, res) => {
  try {
    const loggedUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserID: loggedUser._id }, { toUserID: loggedUser._id }],
    }).select("fromUserID toUserID ");
    const hideUserFromFeed = new Set();
    connectionRequest.forEach((request) => {
      hideUserFromFeed.add(request.toUserID.toString());
      hideUserFromFeed.add(request.fromUserID.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedUser._id } },
      ],
    })
      .select("firstName lastName age gender profilePicture aboutMe skills")
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = userRouter;
