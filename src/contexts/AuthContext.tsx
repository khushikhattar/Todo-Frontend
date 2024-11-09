// AuthContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

interface AuthContextProps {
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  loading: boolean; // New loading state
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading to true

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3100/api/v1/users/fetch",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await axios.post(
        "http://localhost:3100/api/v1/users/login",
        credentials,
        {
          withCredentials: true,
        }
      );
      setUser(response.data.user);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3100/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const refreshToken = async () => {
    try {
      await axios.get(
        "http://localhost:3100/api/v1/users/refresh-access-token",
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Failed to refresh access token", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, refreshToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
