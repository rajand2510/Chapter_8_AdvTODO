// routes/historyRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const History = require("../models/History");

const router = express.Router();

// List history for logged-in user (most recent first)
router.get("/", auth, async (req, res) => {
  try {
    const items = await History.find({ userId: req.user._id }).sort({ completedAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optional: get a specific history item
router.get("/:id", auth, async (req, res) => {
  try {
    const item = await History.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
