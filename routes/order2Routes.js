const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//insert to order2 - for items
router.post("/insert-all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("orders2");

    let testData = require("../playground/orders2.json");

    let result = await collection.insertMany(testData);

    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//comments 1
// The $replaceRoot stage in MongoDB aggregation pipeline is used to replace the input document with the specified document. In this case, it replaces the original order document with a newly created document that contains the merged properties of both the matching item document and the original order document.

// The $mergeObjects operator takes two or more objects as arguments and merges them into a single object. The first object in the array returned by the $arrayElemAt operator is the matching item document, and the second object is the original order document ($$ROOT refers to the input document of the pipeline stage).
//
router.get("/test1", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("orders2");

    let result = await collection
      .aggregate([
        //stage 1
        {
          $lookup: {
            from: "items",
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
//////////////////////////////////////////////////////
//Perform Multiple Joins and a Correlated Subquery with $lookup
////////////////////////////////////////////////
const data = [
  { _id: 1, item: "almonds", price: 12, ordered: 2 },
  { _id: 2, item: "pecans", price: 20, ordered: 1 },
  { _id: 3, item: "cookies", price: 10, ordered: 60 },
];

//
router.post("/insert-orders3", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("orders3");

    let testData = data;

    let result = await collection.insertMany(testData);

    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//

//comments 2
// In summary, the code performs a $lookup between the orders collection and the warehouses collection. It adds a new field named stockdata to the matching orders documents. The value of stockdata is an array of objects containing the warehouse and available stock for the ordered item.

// To do this, it uses the $match and $project stages within the $lookup pipeline. It filters the warehouses collection based on the matching item and the required quantity specified in the orders collection. It removes the unnecessary fields using the $project stage. Finally, it adds the filtered results to the stockdata field in the original orders document.
router.get("/warehouses", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("orders3");

    let result = await collection
      .aggregate([
        {
          //1
          $lookup: {
            from: "warehouses",
            let: { order_item: "$item", order_qty: "$ordered" },
            //2
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
              //   { $project: { stock_item: 0, _id: 0 } },
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

//comments 3
// The part { $eq: ["$stock_item", "$$order_item"] }, { $gte: ["$instock", "$$order_qty"] } is a match condition in a $lookup pipeline in MongoDB.

// $eq is a comparison operator that returns true if the values on both sides are equal. In this case, it checks if the value of the field stock_item in the warehouses collection is equal to the value of the order_item field in the current document of the orders collection.

// $gte is a comparison operator that returns true if the first value is greater than or equal to the second value. In this case, it checks if the value of the instock field in the warehouses collection is greater than or equal to the value of the order_qty field in the current document of the orders collection.

// The double dollar signs ($$) indicate that the variable being referenced is an external variable defined in the $lookup stage with the let property. For example, $$order_item references the order_item variable defined in the let property. This allows variables to be passed from one pipeline stage to another in the same $lookup pipeline.
//
module.exports = router;
