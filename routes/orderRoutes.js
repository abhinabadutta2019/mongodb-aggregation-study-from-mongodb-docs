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

//
router.get("/test2", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("orders");

    let result = await collection
      .aggregate([
        {
          $lookup: {
            from: "items",
            localField: "item", // field in the orders collection
            foreignField: "item", // field in the items collection
            as: "fromItems",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$fromItems", 0] }, "$$ROOT"],
            },
          },
        },
        { $project: { fromItems: 0 } },
      ])
      .toArray();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//insert to order2 - for warehouses
router.post("/insert-all2", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("orders2");

    let testData = require("../playground/orders2.json");

    let result = await collection.insertMany(testData);

    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//warehouses
router.get("/warehouses", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("orders2");

    let result = await collection
      .aggregate([
        {
          $lookup: {
            from: "warehouses",
            let: { order_item: "$item", order_qty: "$ordered" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$stock_item", "$$order_item"] },
                      { $gte: ["$instock", "$$order_qty"] },
                    ],
                  },
                },
              },
              { $project: { stock_item: 0, _id: 0 } },
            ],
            as: "stockdata",
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
