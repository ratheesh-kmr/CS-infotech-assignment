import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get('http://localhost:5000/api/admin/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminData(response.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, []);

  if (!adminData) return <p className="loading-spinner"></p>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Admin Dashboard</h1>
        <h2>Profile Information</h2>
        <p><strong>Name:</strong> {adminData.name}</p>
        <p><strong>Email:</strong> {adminData.email}</p>
        <p><strong>Role:</strong> {adminData.role}</p>
        <p><strong>Contact:</strong> {adminData.contact}</p>
        <p><strong>Joined Date:</strong> {adminData.joinedDate}</p>

        <div className="dashboard-buttons">
          <button onClick={() => window.location.href = '/agent'}>Agent Management</button>
          <button onClick={() => window.location.href = '/upload'}>Task Management</button>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
