import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Register } from "./components/registerForm";
import { Login } from "./components/loginForm";
import { Dashboard } from "./components/Dashboard";
import { Logout } from "./components/logout";
import { UpdateUser } from "./components/updateUser";
import { UpdatePassword } from "./components/updatePassword";
import { Todo } from "./components/todoForm";
import Layout from "./components/Layout";
import PrivateRoute from "./components/privateRoute";

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route
              path="dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="todos"
              element={
                <PrivateRoute>
                  <Todo />
                </PrivateRoute>
              }
            />
            <Route path="logout" element={<Logout />} />
            <Route
              path="update-user"
              element={
                <PrivateRoute>
                  <UpdateUser />
                </PrivateRoute>
              }
            />
            <Route
              path="update-password"
              element={
                <PrivateRoute>
                  <UpdatePassword />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};
