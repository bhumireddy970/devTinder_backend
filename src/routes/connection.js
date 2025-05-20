const express = require("express");

const connectionRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userAuth = require("../middleware/auth");

connectionRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      const fromUserId = req.user._id;
      if (!fromUserId) {
        return res.status(401).send("User not authenticated");
      }

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status");
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send("User not found");
      }
      const connectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserID: fromUserId, toUserID: toUserId },
          {
            fromUserID: toUserId,
            toUserID: fromUserId,
          },
        ],
      });
      if (connectionRequest) {
        return res.status(400).send("Connection request already sent");
      }
      const newConnectionRequest = new ConnectionRequestModel({
        fromUserID: fromUserId,
        toUserID: toUserId,
        status: status,
      });
      const data = await newConnectionRequest.save();
      res.status(200).json({
        message:
          req.user.lastName +
          " sent a connection request to " +
          toUser.lastName,
        data,
      });
    } catch (err) {
      console.log(err.message);
      res.status(400).send({ error: err.message });
    }
  }
);

connectionRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status");
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserID: loggedInUserId,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).send("Connection request not found");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.status(200).json({ message: "connection requset " + status, data });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
);

module.exports = connectionRouter;
