import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Define the props for PrivateRoute
interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuth(); // Use 'user' to check if authenticated

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
