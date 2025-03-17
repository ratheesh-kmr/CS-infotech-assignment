const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const Agent = require("../models/agent");
const Record = require("../models/record");
const upload = require("../scripts/uploadFile");

const router = express.Router();

// File Upload and Distribution API
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileExt = req.file.mimetype;

    let records = [];

    // Handle CSV files
    if (fileExt === "text/csv") {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => records.push(row))
        .on("end", async () => {
          await distributeData(records);
          res.json({ message: "CSV file processed and distributed successfully!", data: records });
        });
    }

    // Handle Excel files
    else if (fileExt.includes("spreadsheetml")) {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      await distributeData(jsonData);
      res.json({ message: "Excel file processed and distributed successfully!", data: jsonData });
    }

    else {
      return res.status(400).json({ error: "Unsupported file format!" });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to distribute data among 5 agents
const distributeData = async (records) => {
    const agents = await Agent.find(); // Fetch all agents from MongoDB
    const agentCount = agents.length;
    
    if (agentCount === 0) throw new Error("No agents available!");
  
    let distributedRecords = [];
  
    // Distribute records as evenly as possible
    records.forEach((record, index) => {
      const assignedAgent = agents[index % agentCount]; // Assign round-robin
      distributedRecords.push({ data: record, assignedAgent: assignedAgent._id });
    });
  

  // Save distributed records to MongoDB
  await Record.insertMany(distributedRecords);
};

module.exports = router;
