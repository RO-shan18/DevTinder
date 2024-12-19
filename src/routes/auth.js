const express = require("express");
const authRouter = express.Router();
const { Validate } = require("../utils/validate");
const User = require("../models/User");
const bcrypt = require("bcrypt");

//creating an post api to save the user data to the database
authRouter.post("/signup", async (req, res) => {
  //Never ever trust req.body
  try {
    //validate user
    Validate(req);

    //Encrypt password
    const { FirstName, LastName, Email, Password } = req.body;
    const hashpassword = await bcrypt.hash(Password, 10);

    //This is how we saved user
    const user = new User({
      FirstName,
      LastName,
      Email,
      Password: hashpassword,
    });

    await user.save();
    res.send("User Data saved successfully");
  } catch (err) {
    res.status(400).send("ERR: " + err);
  }
});

//logged in a user
authRouter.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    //Email Checks
    const isvaliduser = await User.findOne({ Email: Email });
    if (!isvaliduser) {
      throw new Error("Invalid Credentials");
    }
    //Compare password
    const iscorrectpass = await isvaliduser.ComparedPassword(Password);

    if (iscorrectpass) {
      //Generate a JWT token
      const token = await isvaliduser.getJWT();
      //send a token
      res.cookie("token", token);
      //Logged in
      res.send("Login Successfully!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERR: " + err);
  }
});

//Logout a user
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });

  res.send("Logout Successfully");
});

module.exports = authRouter;
