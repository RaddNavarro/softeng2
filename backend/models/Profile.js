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
  eventsJoined: {
    type: [String],
    required: true,
  },
  orgStatus: [
    {
      orgID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student-orgs",
      },
      orgName: {
        type: String,
      },
      orgRole: {
        type: String,
      },
    },
  ],
  yearLvl: {
    type: String,
    required: true,
  },
});

module.exports = Profile = mongoose.model("profiles", ProfileSchema);
