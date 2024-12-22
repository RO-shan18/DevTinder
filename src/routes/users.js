const express = require("express");
const UserAuth = require("../middleware/auth");
const RequestConnection = require("../models/requestconnection");
const UserRouter = express.Router();

UserRouter.get("/user/requests/received", UserAuth, async(req, res)=>{
    try{
        //Logged In user
        const loggedInUser = req.user;

        //connection requests 
        const connectionrequest = await RequestConnection.find({
            ToUserId : loggedInUser._id,
            Status : "interested",
        }).populate("FromUserId", "FirstName LastName");

        console.log(connectionrequest);

        if(!connectionrequest){
            return res.send(400).json({message : "No connection request found"});
        }

        res.json({messsage : "Connection request found", data : connectionrequest});

    }catch(err){
        res.status(400).send("ERR: "+ err);
    }
})

UserRouter.get("/user/connections", UserAuth, async(req, res)=>{
    try{    
        //LoggedinUser
        const LoggedInUser = req.user;

        //LoggedinUser can be from user id and also to user id 
        //Status must be accepted
        const connectionrequest = await RequestConnection.find({
            $or : [
                {FromUserId : LoggedInUser._id, Status : "accepted"},
                {ToUserId : LoggedInUser._id, Status : "accepted"}
            ]
        }).populate("FromUserId", "FirstName LastName").populate("ToUserId", "FirstName LastName");

        const data = connectionrequest.map((row) => {
            if(row.FromUserId._id.toString() === LoggedInUser._id.toString())
            return row.ToUserId;
            else
            return row.FromUserId;
        })

        res.send({message : data});
    }catch(err){
        res.status(400).send("ERR: " + err);
    }
})

module.exports = UserRouter;
