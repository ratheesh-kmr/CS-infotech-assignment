const express = require("express");
const router = express.Router();
const Record = require("../models/record"); // Ensure correct model path

// GET all records
router.get("/records", async (req, res) => {
  try {
    const records = await Record.find().populate("assignedAgent", "name email");
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
