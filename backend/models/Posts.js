const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profiles",
  },
  studentOrgs: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = Posts = mongoose.model("posts", PostsSchema);
