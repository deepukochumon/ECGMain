//new edit by jissin protected route

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth(); // Use `user`, not `currentUser`

  if (!user) {
    console.log("🚨 No user found! Redirecting to /login...");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // This allows child routes to be rendered
};

export default ProtectedRoute;
