// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    if (!token) return res.status(401).json({ error: "No token provided" });

    // Verify JWT using your app secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB
    const user = await User.findOne({ sub: decoded.sub });
    if (!user) return res.status(401).json({ error: "User not found" });

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = auth;
