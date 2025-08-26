const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const Group = require("../models/Group");
const SubGroup = require("../models/SubGroup");
const Task = require("../models/Task");
const History = require("../models/History");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body; 
    if (!credential) return res.status(400).json({ error: "Credential required" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // check if user already exists
    let user = await User.findOne({ sub });

    const isNewUser = !user; // <-- flag to know if it's first time

    // create or update user
    user = await User.findOneAndUpdate(
      { sub },
      { name, email, imageUrl: picture },
      { upsert: true, new: true }
    );

    // if new user -> create default group, subgroup, task
    if (isNewUser) {
      const group = await Group.create({
        name: "My First Group",
        userId: user._id,
      });

      const subGroup = await SubGroup.create({
        name: "General",
        color: "red",
        groupId: group._id,
        userId: user._id,
      });

      await Task.create({
        text: "Welcome to your To-Do app 🎉",
        priority: "medium",
        completed: false,
        userId: user._id,
        subGroupId: subGroup._id,
      });
    }

    // sign a JWT
    const token = jwt.sign({ sub: user.sub }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ user, token, isNewUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Google login failed" });
  }
};

module.exports = { googleLogin };





// Get logged-in user info
const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ sub: req.user.sub });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get completed task history
const getHistory = async (req, res) => {
  try {
    // Ensure user exists
    const user = await User.findOne({ sub: req.user.sub });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch all history records for this user
    const history = await History.find({ userId: user._id })
      .sort({ createdAt: -1 }); // latest first

    res.json(history || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { googleLogin, getMe, getHistory };
