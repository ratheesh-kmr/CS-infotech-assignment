const express = require("express");
const bcrypt = require("bcryptjs");
const Agent = require("../models/agent");

const router = express.Router();

// ➤ Create Agent
router.post("/", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      let message = existingAgent.email === email ? "Email already exists" : "Mobile number already exists";
      return res.status(400).json({ message });
    }
    const newAgent = new Agent({ name, email, mobile, password });
    await newAgent.save();
    res.status(201).json({ message: "Agent created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ➤ Get All Agents
router.get("/", async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ➤ Update Agent
router.put("/:id", async (req, res) => {
  const { name, email, mobile } = req.body;
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, { name, email, mobile }, { new: true });
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ➤ Delete Agent
router.delete("/:id", async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/records", async (req, res) => {
  try {
    const records = await Record.find().populate("assignedAgent", "name email"); // Populate agent details
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
