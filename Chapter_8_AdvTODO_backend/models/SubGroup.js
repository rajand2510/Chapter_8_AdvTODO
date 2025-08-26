// models/SubGroup.js
const mongoose = require("mongoose");

const subGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    color: { type: String, enum: ["red", "blue", "green", "yellow"], default: "red" },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

subGroupSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "subGroupId"
});

subGroupSchema.set("toObject", { virtuals: true });
subGroupSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("SubGroup", subGroupSchema);
