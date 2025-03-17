import { useState, useEffect } from "react";
import axios from "axios";
import "./FileUpload.css";
import { Link } from 'react-router-dom'; // Import Link

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [records, setRecords] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchRecords();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/records");
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="file-upload-container-small">
      <Link to="/agent" className="back-button">
        &lt; Back to Agents
      </Link>

      <h2 className="file-upload-title-small">Upload File</h2>

      <div className="file-upload-box-small">
        <h2>Select File</h2>
        <input type="file" onChange={handleFileChange} className="file-input-small" />
        <button onClick={handleUpload} className="upload-button-small">
          Upload
        </button>
      </div>

      <div className="records-table-small">
        <h2>Distributed Records</h2>
        <table>
          <thead>
            <tr>
              <th>Record Data</th>
              <th>Assigned Agent</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td>{JSON.stringify(record.data)}</td>
                <td>{record.assignedAgent?.name || "Not Assigned"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileUpload;