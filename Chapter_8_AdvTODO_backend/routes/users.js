const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { googleLogin, getMe, getHistory } = require("../controllers/userController");

// Google login
router.post("/google-login", googleLogin);

// Get logged-in user info
router.get("/me", auth, getMe);  // 👈 use getMe controller

// Get completed tasks history
router.get("/history", auth, getHistory);

module.exports = router;
