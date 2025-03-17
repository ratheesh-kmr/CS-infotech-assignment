import { useEffect, useState } from "react";
import './dashboard.css'

function Dashboard() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      const response = await fetch("http://localhost:5000/api/agents", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await response.json();
      setAgents(data);
    };

    fetchAgents();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Agents List</h3>
      <ul>
        {agents.map((agent) => (
          <li key={agent._id}>{agent.name} - {agent.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
