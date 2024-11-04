import React, { useState } from "react";
import axios, { AxiosError } from "axios";

interface UpdatePasswordData {
  password: string;
}

interface UpdatePasswordResponse {
  message: string;
}

export const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [cPassword, setCPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const updatePassword = async () => {
    const data: UpdatePasswordData = { password };

    if (password !== cPassword) {
      setMessage("Passwords do not match.");
      showAlert();
      return;
    }

    try {
      const response = await axios.patch<UpdatePasswordResponse>(
        "http://localhost:3100/api/v1/users/update-password",
        data
      );
      setMessage(response.data.message || "Password update successful");
      showAlert();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        setMessage(axiosError.response?.data?.message || "Update failed");
      } else {
        setMessage("An unexpected error occurred");
      }
      showAlert();
    }
  };

  const showAlert = () => {
    if (message) {
      alert(message);
    }
  };

  return (
    <>
      <div>
        <label>
          Enter New Password:
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Confirm Password:
          <input
            type="password"
            placeholder="Confirm New Password"
            value={cPassword}
            onChange={(e) => setCPassword(e.target.value)}
          />
        </label>
      </div>
      <button onClick={updatePassword}>Update Password</button>
    </>
  );
};
