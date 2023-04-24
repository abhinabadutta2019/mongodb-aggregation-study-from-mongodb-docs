const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

//add documents to mongo cloud
router.post("/insert-all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("absences");

    let testData = require("../playground/absences .json");

    //
    let newTestData = testData;
    //

    for (let i = 0; i < newTestData.length; i++) {
      //   console.log(testData[index].sickdays);
      //   let newArray = testData[i].sickdays;

      //
      let newArray = newTestData[i].sickdays;
      console.log(newTestData[i].sickdays, "a");

      //   let emptyArray;
      for (let j = 0; j < newArray.length; j++) {
        // console.log(newArray[j], "a");
        //
        newArray[j] = new Date(newArray[j]);
        // console.log(newArray[j], "b");
        //
        // emptyArray.push(newArray);
      }
      //now newArray updates moving to --newTestData[i].sickdays
      newTestData[i].sickdays = newArray;
      //
      console.log(newArray, "b");
      console.log(newTestData[i].sickdays, "c");
    }

    let result = await collection.insertMany(newTestData);

    res.send(result);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
module.exports = router;
