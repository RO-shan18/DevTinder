const express = require("express");
const requestRouter = express.Router();
const UserAuth = require("../middleware/auth");
const RequestConnection = require("../models/requestconnection");
const User = require("../models/User");

requestRouter.post(
  "/request/send/:status/:userid",
  UserAuth,
  async (req, res) => {
    try {
      const ToUserId = req.params.userid;
      const FromUserId = req.user._id;
      const Status = req.params.status;

      //Allowed status
      const AllowedStatus = ["interested", "ignored"];

      const isallowed = AllowedStatus.includes(Status);

      if (!isallowed) {
        return res.status(400).json({ message: "Invalid status" });
      }

      //User exists inside the database
      const user = await User.findById(ToUserId);
      if (!user) {
        return res.status(400).json({ message: "Invalid user" });
      }

      //Checks If user already exists inside the database
      const existuser = await RequestConnection.findOne({
        $or: [
          { FromUserId, ToUserId },
          { FromUserId: ToUserId, ToUserId: FromUserId },
        ],
      });
      0;

      if (existuser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const Requestconnection = new RequestConnection({
        FromUserId,
        ToUserId,
        Status,
      });

      const data = await Requestconnection.save();

      res.json({
        message: "Connection request send successfully!!",
        data,
      });
    } catch (err) {
      res.status(400).send("ERR: " + err);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestid",
  UserAuth,
  async (req, res) => {
    try {
      //status is valid
      const loggedinUser = req.user;
      const { status, requestid } = req.params;

      //check whether the status is allowed or not
      const allowedstatus = ["accepted", "rejected"];

      if (!allowedstatus.includes(status)) {
        return res.status(400).json({ message: "Status is invalid" });
      }

      //loggedinUser : toUserId
      //status : interested
      //requestid should be present
      const requestconnection = await RequestConnection.findOne({
        _id: requestid,
        ToUserId: loggedinUser._id,
        Status: "interested"
      });

      if (!requestconnection) {
        return res.status(400).json({ message: "User not found" });
      }

      //changing the status if all ore ok
      requestconnection.Status = status;
      console.log(requestconnection);
      //save to the database
      const data = await requestconnection.save();

      res.json({ message: "It's a match", data });
    } catch (err) {
      res.status(400).send("ERR: " + err);
    }
  }
);

module.exports = requestRouter;
