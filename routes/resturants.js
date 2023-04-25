const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const data = [
  {
    _id: 1,
    name: "American Steak House",
    food: ["filet", "sirloin"],
    beverages: ["beer", "wine"],
  },
  {
    _id: 2,
    name: "Honest John Pizza",
    food: ["cheese pizza", "pepperoni pizza"],
    beverages: ["soda"],
  },
];

//
//add documents to mongo cloud
router.post("/insert-all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("resturants");

    let testData = data;

    let result = await collection.insertMany(testData);

    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//get all data
router.get("/all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("resturants");

    let result = await collection.find({}).toArray();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//

module.exports = router;
