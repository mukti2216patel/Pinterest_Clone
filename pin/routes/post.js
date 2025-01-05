const mongoose = require("mongoose");

//mongoose.connect("mongodb://localhost:27017/pin");

const postSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  description: String,
  postimage:String,
});

const post = mongoose.model("post", postSchema);

module.exports = post;
