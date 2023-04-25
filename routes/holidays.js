const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const data = [
  { _id: 1, year: 2018, name: "New Years", date: new Date("2018-01-01") },
  { _id: 2, year: 2018, name: "Pi Day", date: new Date("2018-03-14") },
  { _id: 3, year: 2018, name: "Ice Cream Day", date: new Date("2018-07-15") },
  { _id: 4, year: 2017, name: "New Years", date: new Date("2017-01-01") },
  { _id: 5, year: 2017, name: "Ice Cream Day", date: new Date("2017-07-16") },
];

//add documents to mongo cloud
router.post("/insert-all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("holidays");

    let testData = data;

    let result = await collection.insertMany(testData);

    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
