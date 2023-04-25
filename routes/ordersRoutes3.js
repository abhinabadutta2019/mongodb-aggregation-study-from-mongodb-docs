const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

//
const data = [
  {
    _id: 1,
    item: "filet",
    restaurant_name: "American Steak House",
  },
  {
    _id: 2,
    item: "cheese pizza",
    restaurant_name: "Honest John Pizza",
    drink: "lemonade",
  },
  {
    _id: 3,
    item: "cheese pizza",
    restaurant_name: "Honest John Pizza",
    drink: "soda",
  },
];

//
//add documents to mongo cloud
router.post("/insert-all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("orders");

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
    const collection = mongoose.connection.collection("orders");

    let result = await collection.find({}).toArray();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});
//lookup example 6- mongo document website
router.get("/restaurants", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("orders");

    let result = await collection
      .aggregate([
        {
          $lookup: {
            from: "restaurants",
            localField: "restaurant_name",
            foreignField: "name",
            let: { orders_drink: "$drink" },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ["$$orders_drink", "$beverages"] },
                },
              },
            ],
            as: "matches",
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
router.get("/restaurants-2", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("orders");

    let result = await collection
      .aggregate([
        {
          $lookup: {
            from: "restaurants",
            let: {
              orders_restaurant_name: "$restaurant_name",
              orders_drink: "$drink",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$orders_restaurant_name", "$name"] },
                      { $in: ["$$orders_drink", "$beverages"] },
                    ],
                  },
                },
              },
            ],
            as: "matches",
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
