import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import AgentManagement from "./pages/agentManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/agents" element={<ProtectedRoute><AgentManagement /></ProtectedRoute>} /> */}
        <Route path="/agent" element = {<AgentManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
