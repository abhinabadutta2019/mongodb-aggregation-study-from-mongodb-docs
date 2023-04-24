const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

//add documents to mongo cloud
router.post("/insert-all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("orders");

    let testData = require("../playground/orders.json");

    let result = await collection.insertMany(testData);

    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//get all data
router.get("/all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("orders");

    let result = await collection.find({}).toArray();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//
router.get("/test1", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("orders");

    let result = await collection
      .aggregate([
        {
          $lookup: {
            from: "inventory",
            localField: "item",
            foreignField: "sku",
            as: "inventory_docs",
          },
        },
      ])
      .toArray();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
