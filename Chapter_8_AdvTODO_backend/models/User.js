const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    sub: { type: String, required: true, unique: true }, // Google sub
    name: { type: String, required: true },
    imageUrl: { type: String },
    preferenceTheme: {
      type: String,
      enum: ["orange", "kale", "lavender", "blueberry","raspberry"],
      default: "orange",
    },
    email: { type: String },
    pushSubscriptions: { type: [Object], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
