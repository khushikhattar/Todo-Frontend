import React, { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface LoginData {
  identifier: string;
  password: string;
}

interface LoginResponse {
  message: string;
}

export const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    identifier: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:3100/api/v1/users/login",
        loginData,
        { withCredentials: true }
      );
      setAuthenticated(true); // Set authenticated status
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<LoginResponse>;
        setErrorMessage(
          axiosError.response?.data?.message ||
            "Login failed. Please try again."
        );
      } else {
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username or Email:</label>
          <input
            type="text"
            name="identifier"
            value={loginData.identifier}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
    </div>
  );
};
