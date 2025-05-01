const mongoose = require("mongoose");

const StudentOrgsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
  collegeDepartment: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "profiles",
    // {
    //   profileID: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "profiles",
    //   },
    // },
  },
});

module.exports = StudentOrgs = mongoose.model(
  "student-orgs",
  StudentOrgsSchema
);
