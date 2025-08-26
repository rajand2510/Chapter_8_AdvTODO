// models/Task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"] },
    date: { type: Date },
    reminder: { type: Boolean, default: false },
    reminderTime: { type: Date },
    reminderSent: { type: Boolean, default: false },
    pushSent: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subGroupId: { type: mongoose.Schema.Types.ObjectId, ref: "SubGroup" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
