import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface UpdateResponse {
  message: string;
}

export const UpdateUser: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [originalUsername, setOriginalUsername] = useState<string>("");
  const [originalEmail, setOriginalEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details on component mount
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3100/api/v1/users/fetch",
          {
            withCredentials: true,
          }
        );
        const { username, email } = response.data;
        setUsername(username);
        setEmail(email);
        setOriginalUsername(username);
        setOriginalEmail(email);
      } catch {
        setError("Failed to fetch user details");
      }
    };

    fetchUserDetails();
  }, []);

  const updateUser = async () => {
    // Prepare the updated data, only if values are changed
    const updatedData: { username?: string; email?: string } = {};
    if (username !== originalUsername) updatedData.username = username;
    if (email !== originalEmail) updatedData.email = email;

    // Ensure at least one field is modified
    if (!updatedData.username && !updatedData.email) {
      setError("At least one of 'username' or 'email' must be updated");
      return;
    }

    // Reset messages before the update
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.patch<UpdateResponse>(
        "http://localhost:3100/api/v1/users/update",
        updatedData,
        { withCredentials: true }
      );
      setSuccessMessage(response.data.message || "Update successful");
      // Update original values to new values after successful update
      setOriginalUsername(username);
      setOriginalEmail(email);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || "Update failed");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="update-user">
      <h2>Update Your Details</h2>

      {/* Show error or success message if present */}
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div>
        <label>
          New Username:
          <input
            type="text"
            placeholder="Enter new username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          New Email:
          <input
            type="email"
            placeholder="Enter new email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      <button onClick={updateUser}>Update</button>
      <button onClick={() => navigate("/dashboard")}>Go Back</button>
    </div>
  );
};
