const mongoose = require("mongoose");

const DBconnect = async()=>{
    await mongoose.connect("mongodb+srv://mehraroshan1802:sxZEk2mTrpI03sb0@cluster0.3qiqz.mongodb.net/DevTinder")
}

module.exports = DBconnect;
