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
      commentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
      },
    },
  ],
});

module.exports = Comments = mongoose.model("comments", CommentsSchema);
