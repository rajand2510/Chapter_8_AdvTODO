// models/Group.js
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

groupSchema.virtual("subGroups", {
  ref: "SubGroup",
  localField: "_id",
  foreignField: "groupId"
});

groupSchema.set("toObject", { virtuals: true });
groupSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Group", groupSchema);
