const express = require("express");

const profileRouter = express.Router();

const UserAuth = require("../middleware/auth");
const { ValidateEditProfileData } = require("../utils/validate");
const bcrypt = require("bcrypt")
const User = require("../models/Schema");

//user profile
profileRouter.get("/profile/view", UserAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERR: " + err);
  }
});

profileRouter.patch("/profile/edit", UserAuth, async (req, res) => {
  try {
    if (!ValidateEditProfileData(req)) {
      throw new Error("Invalid Profile Edit request");
    }
    //loggedinUser
    const loggedinUser = req.user;

    //saving the updating data to the loggedinUser
    Object.keys(req.body).forEach((key) => (loggedinUser[key] = req.body[key]));

    //Update data into database
    await loggedinUser.save();

    res.json(`${loggedinUser.FirstName},'s profile update successfully!!!!`);

  } catch (err) {
    res.status(400).send("ERR: " + err);
  }
});

profileRouter.patch("/profile/password", UserAuth, async (req, res) => {
  try{
    //Forgot Password
    req.user.Password = null;
    
    //New Password from the user
    const NewPassword = req.body.Password;

    //Encryption the password
    const hashedpassword =  await bcrypt.hash(NewPassword, 10);

     req.user.Password = hashedpassword;

    req.user.save();
    res.json("Password Change Successfully");
  }catch(err){
    res.status(400).send("ERR: " + err);
  }
})

module.exports = profileRouter;
