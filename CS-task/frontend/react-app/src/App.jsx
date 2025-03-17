import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AgentManagement from "./pages/agentManagement";
import FileUpload from "./components/FileUpload";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/agents" element={<ProtectedRoute><AgentManagement /></ProtectedRoute>} /> */}
        <Route path="/agent" element = {<AgentManagement />} />
        <Route path="/upload" element={<FileUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
