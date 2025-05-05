const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  postID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profiles",
  },
  body: {
    type: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
      default: false,
    },
  ],
});

module.exports = Comments = mongoose.model("comments", CommentsSchema);
