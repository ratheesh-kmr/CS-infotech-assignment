import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./FileUpload.css";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [records, setRecords] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const taskRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];

    if (!selectedFile) return;
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Invalid file format. Please upload a CSV or Excel file.");
      setFile(null);
    } else {
      setFile(selectedFile);
    }
  };

  const validateFileContent = (data) => {
    const requiredFields = ["FirstName", "Phone", "Notes"];
    const headers = Object.keys(data[0] || {});
    const missingFields = requiredFields.filter((field) => !headers.includes(field));

    if (missingFields.length > 0) {
      alert(`Invalid file format. Missing fields: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = e.target.result;
      let parsedData = [];

      if (file.type === "text/csv") {
        const result = Papa.parse(data, { header: true });
        parsedData = result.data;
      } else {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      }

      if (!validateFileContent(parsedData)) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post("http://localhost:5000/api/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
        fetchRecords();
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };

    file.type === "text/csv" ? reader.readAsText(file) : reader.readAsBinaryString(file);
  };

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/records");
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const clearRecords = async () => {
    if (window.confirm("Are you sure you want to clear all records? This action cannot be undone.")) {
      try {
        await axios.delete("http://localhost:5000/api/records");
        setRecords([]);
        alert("All records have been cleared successfully.");
      } catch (error) {
        console.error("Error clearing records:", error);
      }
    }
  };

  const handleAgentClick = (agent) => {
    const agentTasks = records
      .filter((record) => record?.assignedAgent?.name === agent.name)
      .map((record) => record?.data?.Notes || "No task available");

    setSelectedAgent(agent);
    setTasks(agentTasks);

    setTimeout(() => {
      taskRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const uniqueAgents = [...new Map(records.map((record) => [record?.assignedAgent?.name, record.assignedAgent])).values()];

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="file-upload-container-full">
      <Link to="/agent" className="back-button">&lt; Back to Agents</Link>
      <h2 className="file-upload-title-full">Task Management</h2>

      <div className="file-upload-box-full">
        <h2>Select File</h2>
        <input type="file" onChange={handleFileChange} className="file-input-full" accept=".csv, .xlsx, .xls" />
        <button onClick={handleUpload} className="upload-button-full">Upload</button>
      </div>

      <div className="records-table-full">
        <h2>Assigned Agents</h2>
        {uniqueAgents.length > 0 ? (
          <div>
            {uniqueAgents.map((agent, index) => (
              <button key={index} onClick={() => handleAgentClick(agent)} className="agent-button-full">
                {agent.name}
              </button>
            ))}
            <button onClick={clearRecords} className="clear-button-full">Clear Records</button>
          </div>
        ) : (
          <p>No records available. Please upload a file.</p>
        )}

        {selectedAgent && tasks.length > 0 && (
          <div className="tasks-list-full" ref={taskRef}>
            <h3>Tasks for {selectedAgent.name}</h3>
            {tasks.map((task, index) => (
              <p key={index}>{task}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
