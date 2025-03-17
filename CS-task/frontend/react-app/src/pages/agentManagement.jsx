import { useEffect, useState } from "react";
import "./AgentManagement.css"; 

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({ name: "", email: "", mobile: "", password: "" });

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
    const res = await fetch("http://localhost:5000/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAgent),
    });
    if (res.ok) {
      fetchAgents();
      setNewAgent({ name: "", email: "", mobile: "", password: "" });
    }
  };

  const deleteAgent = async (id) => {
    await fetch(`http://localhost:5000/agents/${id}`, { method: "DELETE" });
    fetchAgents();
  };

  return (
    <div className="agent-container">
      <h1 className="agent-title">Agent Management</h1>

      {/* Form for Adding Agents */}
      <form onSubmit={addAgent} className="agent-form">
        <h2 className="text-xl font-semibold mb-4">Add New Agent</h2>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Name" value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={newAgent.email} onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })} required />
          <input type="text" placeholder="Mobile" value={newAgent.mobile} onChange={(e) => setNewAgent({ ...newAgent, mobile: e.target.value })} required />
          <input type="password" placeholder="Password" value={newAgent.password} onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })} required />
        </div>
        <button type="submit">Add Agent</button>
      </form>

      {/* Agent List */}
      <div className="agent-table">
        <h2 className="text-xl font-semibold mb-4">Agents List</h2>
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
