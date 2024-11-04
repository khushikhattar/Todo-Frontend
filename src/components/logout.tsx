import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Logout: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useAuth();

  const handleLogout = async () => {
    if (authContext) {
      await authContext.logout();
      navigate("/login");
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};
