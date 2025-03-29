import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./AgentManagement.css";

function MobileInputWithCountryCode({ value, onChange }) {
  const [countryCode, setCountryCode] = useState(value.countryCode || "+91");

  const handleMobileChange = (e) => {
    const phoneNumber = e.target.value;
    if (/^\d{0,10}$/.test(phoneNumber)) {
      onChange({ countryCode, mobile: phoneNumber });
    }
  };

  const handleCountryCodeChange = (e) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    onChange({ countryCode: newCode, mobile: value.mobile || "" });
  };

  return (
    <div className="mobile-input">
      <select value={countryCode} onChange={handleCountryCodeChange}>
        <option value="+1">🇺🇸 +1</option>
        <option value="+44">🇬🇧 +44</option>
        <option value="+91">🇮🇳 +91</option>
      </select>
      <input
        type="text"
        placeholder="Mobile Number (10 digits)"
        value={value.mobile || ""}
        onChange={handleMobileChange}
        required
      />
    </div>
  );
}

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    mobile: { countryCode: "+91", mobile: "" },
    password: "",
  });
  const [editingAgent, setEditingAgent] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const res = await fetch("http://localhost:5000/agents");
    const data = await res.json();
    setAgents(data);
  };

  const addAgent = async (e) => {
    e.preventDefault();

    if (newAgent.name.length < 2) {
      alert("Name should have at least 2 characters.");
      return;
    }

    if (newAgent.mobile.mobile.length !== 10) {
      alert("Mobile number should be exactly 10 digits.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAgent,
          mobile: `${newAgent.mobile.countryCode}${newAgent.mobile.mobile}`,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add agent");
      }

      alert("Agent created successfully!");
      fetchAgents();
      setNewAgent({ name: "", email: "", mobile: { countryCode: "+91", mobile: "" }, password: "" });
    } catch (error) {
      alert(error.message);
    }
  };

  const updateAgent = async (e) => {
    e.preventDefault();

    if (editingAgent.name.length < 2) {
      alert("Name should have at least 2 characters.");
      return;
    }

    if (editingAgent.mobile.mobile.length !== 10) {
      alert("Mobile number should be exactly 10 digits.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/agents/${editingAgent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingAgent,
          mobile: `${editingAgent.mobile.countryCode}${editingAgent.mobile.mobile}`,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update agent");
      }

      alert("Agent updated successfully!");
      fetchAgents();
      setEditingAgent(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteAgent = async (id) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      await fetch(`http://localhost:5000/agents/${id}`, { method: "DELETE" });
      fetchAgents();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleEdit = (agent) => {
    const countryCode = agent.mobile.slice(0, 3);
    const mobileNumber = agent.mobile.slice(3);
    setEditingAgent({
      ...agent,
      mobile: { countryCode, mobile: mobileNumber },
    });
    window.scrollTo({ top: formRef.current.offsetTop, behavior: "smooth" });
  };

  return (
    <div className="agent-container">
      <div className="top-bar">
        <Link to="/dashboard" className="back-button">&lt; Back to Dashboard</Link>
        <h1 className="agent-title">Agent Management</h1>
      </div>

      <form ref={formRef} onSubmit={editingAgent ? updateAgent : addAgent} className="agent-form">
        <h2>{editingAgent ? "Edit Agent" : "Add New Agent"}</h2>
        <input
          type="text"
          placeholder="Name (Min 2 Characters)"
          value={editingAgent ? editingAgent.name : newAgent.name}
          onChange={(e) => editingAgent 
            ? setEditingAgent({ ...editingAgent, name: e.target.value }) 
            : setNewAgent({ ...newAgent, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={editingAgent ? editingAgent.email : newAgent.email}
          disabled={!!editingAgent}
          required
        />
        <MobileInputWithCountryCode
          value={editingAgent ? editingAgent.mobile : newAgent.mobile}
          onChange={(value) => editingAgent 
            ? setEditingAgent({ ...editingAgent, mobile: value }) 
            : setNewAgent({ ...newAgent, mobile: value })}
        />

        {!editingAgent && (
          <input
            type="password"
            placeholder="Password"
            value={newAgent.password}
            onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
            required
          />
        )}

        <button type="submit">{editingAgent ? "Update Agent" : "Add Agent"}</button>
      </form>

      <div className="agent-table">
        <h2>Agents List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent._id}>
                <td>{agent.name}</td>
                <td>{agent.email}</td>
                <td>{agent.mobile}</td>
                <td>
                  <button onClick={() => handleEdit(agent)}>Edit</button>
                  <button onClick={() => deleteAgent(agent._id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentManagement;
