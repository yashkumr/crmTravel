import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth.jsx";


const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // Check if the user is authenticated


  return isAuthenticated ? children : <Navigate to="/zts-login" />;
};

export default PrivateRoute;
