const mongoose = require("mongoose");

const worldSchema = new mongoose.Schema({
  // if you add auth later, add userId here
  trees: { type: Number, default: 0 },
  buildings: { type: Number, default: 0 },
  stars: { type: Number, default: 0 }
});

module.exports = mongoose.model("World", worldSchema);
