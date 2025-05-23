const mongoose = require("mongoose");

const EventsSchema = new mongoose.Schema({
  studentOrg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student-orgs",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // eventDate: {
  //   type: String,
  //   required: true,
  // },
  eventDateFrom: {
    type: Date,
    required: true,
  },
  eventDateTo: {
    type: Date,
    required: true,
  },
  eventPlace: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  // optional
  // priority: {
  //     type: String,
  //     required: true
  // },
  // eventType: {
  //     type: String,
  //     required: true
  // }
});

module.exports = Events = mongoose.model("events", EventsSchema);
