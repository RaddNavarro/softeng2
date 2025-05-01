const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profiles",
  },
  studentOrgs: {
    type: String,
    ref: "student-orgs",
  },
  title: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = Posts = mongoose.model("posts", PostsSchema);
