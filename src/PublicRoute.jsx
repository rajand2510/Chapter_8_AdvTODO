import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    
    return <Navigate to="/home" replace />;
  }
  return children;
};

export default PublicRoute;
