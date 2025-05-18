const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  hasLoggedIn: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
});

const UsersModel = mongoose.model("users", UsersSchema);

module.exports = UsersModel;
