import React, { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AuthContext } from "../contexts/AuthContext";

const Layout: React.FC = () => {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated;

  return (
    <div>
      <Header />
      <nav>
        {!isAuthenticated ? (
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
