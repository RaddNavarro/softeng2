const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  contactNum: {
    type: String,
  },
  bio: {
    type: String,
  },
  collegeDepartment: {
    type: String,
    required: true,
  },
  joinedOrgs: {
    type: [String],
    required: true,
  },
  eventsJoined: {
    type: [String],
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  yearLvl: {
    type: String,
    required: true,
  },
});

module.exports = Profile = mongoose.model("profiles", ProfileSchema);
