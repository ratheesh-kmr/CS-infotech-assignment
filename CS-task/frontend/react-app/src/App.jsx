import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AgentManagement from "./pages/agentManagement";
import FileUpload from "./components/FileUpload";
import ProtectedRoute from "./components/protectedRoutes";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/agent" element={<ProtectedRoute><AgentManagement /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><FileUpload /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
