require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const aircraftRoutes = require("./routes/aircraft");
const Admin = require("./models/Admin");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/aircrafts", aircraftRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Aviation Interactive Learning Backend is running 🚀");
});

// Create default admin if not exists
async function ensureAdminExists() {
  try {
    const admin = await Admin.findOne({ username: "admin" });
    if (!admin) {
      await Admin.create({
        username: "admin",
        password: "admin123" // auto-hashed by model
      });
      console.log("Default admin created");
    } else {
      console.log("Admin already exists");
    }
  } catch (err) {
    console.error("Admin creation error:", err);
  }
}

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Atlas connected");
    await ensureAdminExists();
  })
  .catch(err => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});