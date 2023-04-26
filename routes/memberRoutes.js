const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
//
const data = [
  { _id: 1, name: "artie", joined: new Date("2016-05-01"), status: "A" },
  { _id: 2, name: "giraffe", joined: new Date("2017-05-01"), status: "D" },
  { _id: 3, name: "giraffe1", joined: new Date("2017-10-01"), status: "A" },
  { _id: 4, name: "panda", joined: new Date("2018-10-11"), status: "A" },
  { _id: 5, name: "pandabear", joined: new Date("2018-12-01"), status: "A" },
  { _id: 6, name: "giraffe2", joined: new Date("2018-12-01"), status: "D" },
];

//add documents to mongo cloud
router.post("/insert-all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("members");

    let result = await collection.insertMany(data);

    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//get all data
router.get("/all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("members");

    let result = await collection.find({}).toArray();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//my try-- not following mongo docs

router.get("/test1", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("members");

    let result = await collection
      .aggregate([
        {
          $lookup: {
            from: "classes",
            localField: "name",
            foreignField: "enrollmentlist",
            as: "enrollee_info",
          },
        },
      ])
      .toArray();
    //
    console.log(result);
    //
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});
//

module.exports = router;
