const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

//add documents to mongo cloud
router.post("/insert-all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("items");

    let testData = require("../playground/items.json");

    let result = await collection.insertMany(testData);

    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//get all data
router.get("/all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("items");

    let result = await collection.find({}).toArray();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
