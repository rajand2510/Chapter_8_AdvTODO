const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Save push subscription
router.post("/subscribe", auth, async (req, res) => {
  try {
    const subscription = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: "Invalid subscription object" });
    }

    // Avoid duplicate subscriptions
    const exists = req.user.pushSubscriptions.some(
      (sub) => sub.endpoint === subscription.endpoint
    );

    if (!exists) {
      req.user.pushSubscriptions.push(subscription);
      await req.user.save();
    }

    res.status(200).json({ message: "Push subscription saved successfully" });
  } catch (err) {
    console.error("Push subscription error:", err);
    res.status(500).json({ error: "Failed to save subscription" });
  }
});

module.exports = router;
