// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated && location.pathname !== "/") {
    // Redirect to home if not authenticated and trying to access a protected route
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && location.pathname === "/") {
    // Redirect to dashboard if authenticated and trying to access the home page
    return <Navigate to="/dashboard" replace />;
  }

  return children; // Allow access to the requested route
};

export default ProtectedRoute;
