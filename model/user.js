const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
  //adding time/date
  time: { type: Date, default: Date.now },
});

//
const User = mongoose.model("User", userSchema);
//
module.exports = User;
