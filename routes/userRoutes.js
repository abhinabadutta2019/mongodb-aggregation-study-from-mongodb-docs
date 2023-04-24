const express = require("express");
const User = require("../model/user");
const mongoose = require("mongoose");
const router = express.Router();
//

//get route for getting all collection data- without creating schema
router.get("/all", async (req, res) => {
  const collection = mongoose.connection.collection("users");

  //to array na add korar jonno kaj korchilo naa
  let allUser = await collection.find({}).toArray();

  res.send(allUser);
});

//

//seed route

router.get("/seed", async (req, res) => {
  await User.deleteMany({});

  //
  await User.create([
    { email: "aadmin", password: "1234" },
    { email: "admin1", password: "12345" },
  ]);
  res.send();
});

module.exports = router;
