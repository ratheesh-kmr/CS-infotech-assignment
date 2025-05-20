const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const Agent = require("../models/agent");
const Record = require("../models/record");
const upload = require("../scripts/uploadFile");

const router = express.Router();


router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileExt = req.file.mimetype;

    let records = [];

    
    if (fileExt === "text/csv") {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => records.push(row))
        .on("end", async () => {
          await distributeData(records);
          res.json({ message: "CSV file processed and distributed successfully!", data: records });
        });
    }

    
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


const distributeData = async (records) => {
  const agents = await Agent.find(); 
  const agentCount = agents.length;

  if (agentCount === 0) throw new Error("No agents available!");

  let distributedRecords = [];
  const totalRecords = records.length;

  const baseTasksPerAgent = Math.floor(totalRecords / agentCount);
  const extraTasks = totalRecords % agentCount;

  let recordIndex = 0;

  agents.forEach((agent, index) => {
    const tasksForThisAgent = baseTasksPerAgent + (index < extraTasks ? 1 : 0);

    for (let i = 0; i < tasksForThisAgent; i++) {
      distributedRecords.push({
        data: records[recordIndex],
        assignedAgent: agent._id
      });
      recordIndex++;
    }
  });

  // Save distributed records to MongoDB
  await Record.insertMany(distributedRecords);
};


module.exports = router;
