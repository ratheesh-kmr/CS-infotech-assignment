import React, { useEffect, useState } from "react";
import "./AgentManagement.css";

function MobileInputWithCountryCode({ value, onChange }) {
  const [countryCode, setCountryCode] = useState(value.countryCode || "+91");

  const handleMobileChange = (e) => {
    onChange({ countryCode, mobile: e.target.value });
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
    onChange({ countryCode: e.target.value, mobile: value.mobile || "" });
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
        placeholder="Mobile Number"
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

  return (
    <div className="agent-container">
      <div className="top-bar">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        <h1 className="agent-title">Agent Management</h1>
      </div>

      <form onSubmit={editingAgent ? updateAgent : addAgent} className="agent-form">
        <h2>{editingAgent ? "Edit Agent" : "Add New Agent"}</h2>
        <input
          type="text"
          placeholder="Name"
          value={editingAgent ? editingAgent.name : newAgent.name}
          onChange={(e) => editingAgent ? setEditingAgent({ ...editingAgent, name: e.target.value }) : setNewAgent({ ...newAgent, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={editingAgent ? editingAgent.email : newAgent.email}
          onChange={(e) => editingAgent ? setEditingAgent({ ...editingAgent, email: e.target.value }) : setNewAgent({ ...newAgent, email: e.target.value })}
          required
        />
        <MobileInputWithCountryCode
          value={editingAgent ? editingAgent.mobile : newAgent.mobile}
          onChange={(value) => editingAgent ? setEditingAgent({ ...editingAgent, mobile: value }) : setNewAgent({ ...newAgent, mobile: value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={editingAgent ? editingAgent.password : newAgent.password}
          onChange={(e) => editingAgent ? setEditingAgent({ ...editingAgent, password: e.target.value }) : setNewAgent({ ...newAgent, password: e.target.value })}
          required
        />
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
                  <button onClick={() => setEditingAgent(agent)}>Edit</button>
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