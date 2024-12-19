const jwt = require("jsonwebtoken");
const User = require("../models/Schema");

const UserAuth = async (req, res, next) => {
  try {
    //reading the token
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token expired");
    }
    //decoding the token
    const decode = await jwt.verify(token, "R0-sh@n4518");

    const { _id } = decode;

    //get the user from the token
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }

    req.user = user;
    next();

  } catch (err) {
    res.status(400).send("ERR: " + err);
  }
};

module.exports = UserAuth;
