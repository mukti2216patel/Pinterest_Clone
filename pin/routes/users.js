const mongoose = require("mongoose");

const plm = require('passport-local-mongoose');
// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/pin");

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  conatct: Number,
  boards: {
    type: Array,
    default: [],
  },
});

userSchema.plugin(plm);
const User = mongoose.model("User", userSchema);

module.exports = User;
