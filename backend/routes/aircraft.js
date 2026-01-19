const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Aircraft = require("../models/Aircraft");

// Get all aircrafts (public)
router.get("/", async (req, res) => {
  try {
    const aircrafts = await Aircraft.find();
    res.json(aircrafts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single aircraft by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const aircraft = await Aircraft.findById(req.params.id);
    if (!aircraft) return res.status(404).json({ message: "Aircraft not found" });
    res.json(aircraft);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new aircraft (admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const aircraft = new Aircraft(req.body);
    await aircraft.save();
    res.json({ message: "Aircraft added", aircraft });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update aircraft (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const aircraft = await Aircraft.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Aircraft updated", aircraft });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete aircraft (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Aircraft.findByIdAndDelete(req.params.id);
    res.json({ message: "Aircraft deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
