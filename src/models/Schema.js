const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 30,
      trim: true,
    },
    LastName: {
      type: String,
      minLength: 4,
      maxLength: 30,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      trim: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Age: {
      type: Number,
      min: 18,
    },
    Gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid Gender");
        }
      },
    },
  },
  { timestamps: true }
);

UserSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "R0-sh@n4518", {
    expiresIn: "1d",
  });

  return token;
};


UserSchema.methods.ComparedPassword = async function (Password) {
  const user = this;

  const hashedpassword = await bcrypt.compare(Password, user.Password);

  return hashedpassword;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
