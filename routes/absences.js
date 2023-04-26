const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

//add documents to mongo cloud
//date jate -string hisabe save naa hoi
//not necessery- json theke na niye -direct js file e - varible er moddhe fele-- easily neoa jeto-
//
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

//get all data
router.get("/all", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("absences");

    let result = await collection.find({}).toArray();
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//
// The $lookup stage performs the lookup operation between the "absences" and "holidays" collections. The from field specifies the collection to look up, and the pipeline field specifies the pipeline of aggregation stages to apply to the "holidays" collection.

// The pipeline for the "holidays" collection includes a $match stage to filter the holidays by year, a $project stage to format the holiday document to only include the name and date fields, and a $replaceRoot stage to replace the holiday document with the date field.

// The as field in the $lookup stage creates a new field called "holidays" in the output document that contains the list of holiday dates for the same year as the absence.

// Finally, the code returns the updated "absences" collection with the "holidays" field included in each document.
//
router.get("/holidays", async (req, res) => {
  try {
    const collection = mongoose.connection.collection("absences");

    let result = await collection
      .aggregate([
        {
          $lookup: {
            from: "holidays",
            pipeline: [
              { $match: { year: 2018 } },
              //
              {
                $project: {
                  _id: 0,
                  date: {
                    name: "$name",
                    date: "$date",
                    //test
                    a: "nn",
                  },
                },
              },
              //
              { $replaceRoot: { newRoot: "$date" } },
            ],
            as: "holidays",
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
