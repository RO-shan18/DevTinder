const express = require("express");
const requestRouter = express.Router();
const UserAuth = require("../middleware/auth");

requestRouter.post("/sendconnectionrequest", UserAuth, async(req, res)=>{

    const FirstName = req.user.FirstName
 
    res.send(FirstName + " Sending you a connection request")
 })

 module.exports = requestRouter;