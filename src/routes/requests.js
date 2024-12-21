const express = require("express");
const requestRouter = express.Router();
const UserAuth = require("../middleware/auth");
const RequestConnection= require("../models/requestconnection");
const User = require("../models/User")

requestRouter.post("/request/send/:status/:userid", UserAuth, async(req, res)=>{
    try{
        const ToUserId = req.params.userid;
        const FromUserId = req.user._id;
        const Status = req.params.status;

        //Allowed status
        const AllowedStatus = ["interested", "ignored"];

        const isallowed = AllowedStatus.includes(Status);

        if(!isallowed){
            return res.status(400).json({"message": "Invalid status"});
        }

        //User exists inside the database
        const user = await User.findById(ToUserId);
        if(!user){
            return res.status(400).json({"message" : "Invalid user"});
        } 

        //Checks If user already exists inside the database
        const existuser = await RequestConnection.findOne({ $or : [
            {FromUserId, ToUserId},
            {FromUserId: ToUserId, ToUserId : FromUserId},
        ] });0

        if(existuser){
            return res.status(400).json({"message" : "User already exists"});
        };

        const Requestconnection = new RequestConnection({
            FromUserId,
            ToUserId,
            Status,
        });

        const data = await Requestconnection.save();

        res.json({
            "message" : "Connection request send successfully!!",
             data,
        })

    }catch(err){
        res.status(400).send("ERR: " + err);
    }
   
 })

requestRouter.post("/request/review/:status/:userid", UserAuth, async(req, res)=>{
    try{
        
    }catch(err){
        res.status(400).send("ERR: " + err);
    }
})

 module.exports = requestRouter;