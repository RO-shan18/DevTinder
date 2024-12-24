const express = require("express");
const UserAuth = require("../middleware/auth");
const RequestConnection = require("../models/requestconnection");
const User = require("../models/User");
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

UserRouter.get("/feed", UserAuth, async(req, res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page * limit) - limit;

        
        limit = limit > 50 ? 50 : limit;
        //loggedinUser
        const LoggedinUser = req.user;

        //feed card must not be
        //=> connected to the loggedinUser
        //=> send a request to the loggedinUser
        //=> should not be yourself
        const connectionrequest = await RequestConnection.find({
            $or : [
                {FromUserId : LoggedinUser._id},
                {ToUserId : LoggedinUser._id}
            ]
        }).select("FromUserId ToUserId")

        const hideusers = new Set();
        connectionrequest.forEach((req)=>{
            hideusers.add(req.FromUserId.toString());
            hideusers.add(req.ToUserId.toString());
        })

        const users = await User.find({
            $and : [
                {_id : {$nin : Array.from(hideusers)}},
                {_id : {$ne : {_id : LoggedinUser._id}}}
            ]
        }).skip(skip).limit(limit);

        res.json({data : users});

    }catch(err){
        res.status(400).send("ERR: " + err);
    }
})

module.exports = UserRouter;
