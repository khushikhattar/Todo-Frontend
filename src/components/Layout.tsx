import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useAuth } from "../contexts/AuthContext";

const Layout: React.FC = () => {
  const { user, loading } = useAuth(); // Access loading from useAuth

  if (loading) {
    return <div>Loading...</div>; // Show loading spinner or message if loading
  }

  return (
    <div>
      <Header />
      <nav>
        {!user ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/logout">Logout</Link>
          </>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
