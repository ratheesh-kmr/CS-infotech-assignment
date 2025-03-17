const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  data: Object, // Store entire row as an object
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
});

module.exports = mongoose.model("Record", recordSchema);
