import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Example: Check for JWT Token

  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
