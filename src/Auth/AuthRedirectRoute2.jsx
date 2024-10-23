import React from "react";
import { Navigate } from "react-router-dom";

const AuthRedirectRoute2 = ({ children, isLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" />; // Redirect to profile if logged in
  }
  return children; // Allow access to children (like Register/Login) if not logged in
};

export default AuthRedirectRoute2;
