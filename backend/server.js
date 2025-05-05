const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { authUser } = require("./middleware/authUser");

const app = express();

//Connect Database
connectDB();

//Initilize Middleware
app.use(express.json({ extended: false }));

app.use(cors());

app.get("/", (req, res) => res.send("Server is running"));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/admin", require("./routes/api/admin"));
app.use("/api/studentOrgs", require("./routes/api/studentOrgs"));
app.use("/api/posts", require("./routes/api/posts"));

// check if user is still authenticated
app.get("/authUser", authUser, (req, res) => {
  return res.json({ msg: "Success" });
});

const PORT = process.env.PORT || 5000;

app.listen(5000, "0.0.0.0", () =>
  console.log(`Server started on port ${PORT}`)
);
