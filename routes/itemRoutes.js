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

//done to test-- not in mongo website example
router.get("/test1", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("items");

    let result = await collection
      .aggregate([
        //stage 1
        {
          $lookup: {
            from: "orders2",
            localField: "item", // field in the orders collection
            foreignField: "item", // field in the items collection
            as: "fromItems",
          },
        },
        //stage 2
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$fromItems", 0] }, "$$ROOT"],
            },
          },
        },
        //stage 3
        // { $project: { fromItems: 0 } },
      ])
      .toArray();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
