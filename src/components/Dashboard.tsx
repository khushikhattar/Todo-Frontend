import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/todos">Go to Todos</Link>
              </li>
              <li>
                <Link to="/update-password">Update User Password</Link>
              </li>
              <li>
                <Link to="/update-user">Update Username or Email</Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">Please log in to access more options</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};
