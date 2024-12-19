const express = require("express");
const DBconnect = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

//Express built-in middleware
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/", profileRouter);
app.use("/", authRouter);
app.use("/", requestRouter);

/* app.patch("/user", async (req, res) => {
  const userid = req.body.id;
  const data = req.body;

  const Allowed_Updates = ["FirstName", "lastname", "Age", "Gender", "id"];

  try {
    const isAllowedUpdates = Object.keys(data).every((k) => {
      return Allowed_Updates.includes(k);
    });

    console.log(isAllowedUpdates);

    if (!isAllowedUpdates) {
      throw new Error("You can't Update your Email and Password!!!");
    }

    await User.findByIdAndUpdate(userid, data);
    res.send("User data update successfully");
  } catch (err) {
    res.status(400).send("Updated Failed: " + err);
  }
}); */

DBconnect()
  .then(() => {
    console.log("Database connection Established");
    app.listen(9999, () => {
      console.log("Server is running on Port no.9999");
    });
  })
  .catch((err) => {
    console.log("Database not connected");
  });
