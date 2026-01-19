require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const aircraftRoutes = require("./routes/aircraft");

const app = express();
const PORT = process.env.PORT || 5000;

const ADMIN = {
  username: "admin",
  password: "admin123"
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/aircrafts", aircraftRoutes);

// MongoDB connection (Atlas)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
