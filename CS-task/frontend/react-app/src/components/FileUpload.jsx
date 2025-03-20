import { useState, useEffect } from "react";
import axios from "axios";
import "./FileUpload.css";
import { Link } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [records, setRecords] = useState([]);

  // Validate File Type
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!selectedFile) return;
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Invalid file format. Please upload a CSV or Excel file.");
      setFile(null);
    } else {
      setFile(selectedFile);
    }
  };

  // Validate File Content
  const validateFileContent = (data) => {
    const requiredFields = ["FirstName", "Phone", "Notes"];
    const headers = Object.keys(data[0] || {});

    const missingFields = requiredFields.filter(
      (field) => !headers.includes(field)
    );
    if (missingFields.length > 0) {
      alert(`Invalid file format. Missing fields: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  // Process and Validate File Before Upload
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
        await axios.post("http://localhost:5000/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        fetchRecords();
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };

    // Read File Based on Type
    if (file.type === "text/csv") {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  // Fetch Records
  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/records");
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  // Clear Records
  const clearRecords = async () => {
    if (
      window.confirm(
        "Are you sure you want to clear all records? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete("http://localhost:5000/api/records");
        setRecords([]); // Clear frontend state
        alert("All records have been cleared successfully.");
      } catch (error) {
        console.error("Error clearing records:", error);
      }
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="file-upload-container-full">
      <Link to="/agent" className="back-button">
        &lt; Back to Agents
      </Link>

      <h2 className="file-upload-title-full">Upload File</h2>

      <div className="file-upload-box-full">
        <h2>Select File</h2>
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input-full"
          accept=".csv, .xlsx, .xls"
        />
        <button onClick={handleUpload} className="upload-button-full">
          Upload
        </button>
      </div>

      <div className="records-table-full">
        <h2>Distributed Records</h2>
        {records.length > 0 ? (
          <>
            <button onClick={clearRecords} className="clear-button-full">
              Clear Records
            </button>
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Phone</th>
                  <th>Notes</th>
                  <th>Assigned Agent</th>
                </tr>
              </thead>
                <tbody>
                {records.map((record, index) => (
                  <tr key={index}>
                    <td>{record?.data?.FirstName || "N/A"}</td>
                    <td>{record?.data?.Phone || "N/A"}</td>
                    <td>{record?.data?.Notes || "N/A"}</td>
                    <td>{record?.assignedAgent?.name || "Not Assigned"}</td>
                  </tr>
                ))}
              </tbody>
                          </table>
          </>
        ) : (
          <p>No records available. Please upload a file.</p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
