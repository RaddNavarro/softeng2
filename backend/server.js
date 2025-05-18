const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { authUser } = require("./middleware/authUser");

const app = express();

// Connect Database
connectDB();

// Initialize Middleware
app.use(express.json()); // Allows Express to parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Basic route for the root URL
app.get("/", (req, res) => res.send("Server is running"));

// Define API routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/admin", require("./routes/api/admin"));
app.use("/api/announcements", require("./routes/api/announcements"));
app.use("/api/studentOrgs", require("./routes/api/studentOrgs"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/events", require("./routes/api/events"));

// Check if user is still authenticated
app.get("/authUser", authUser, (req, res) => {
  return res.json({ msg: "User is authenticated" });
});

// Set the server port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});