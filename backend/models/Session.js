const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  duration: { type: Number, required: true }, // minutes
  category: { type: String, default: "Focus" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Session", sessionSchema);
