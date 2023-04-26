const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

//add documents to mongo cloud
router.post("/insert-all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("classes");

    let testData = require("../playground/classes.json");

    let result = await collection.insertMany(testData);

    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//get all data
router.get("/all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("classes");

    let result = await collection.find({}).toArray();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//
router.get("/test1", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("classes");

    let result = await collection
      .aggregate([
        {
          $lookup: {
            from: "members",
            localField: "enrollmentlist",
            foreignField: "name",
            as: "enrollee_info",
          },
        },
      ])
      .toArray();

    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//

module.exports = router;
