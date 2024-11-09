import React, { useState } from "react";
import axios, { AxiosError } from "axios";

interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}

interface UpdatePasswordResponse {
  message: string;
}

export const UpdatePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [cPassword, setCPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const updatePassword = async () => {
    setMessage("");

    if (newPassword !== cPassword) {
      setMessage("Passwords do not match.");
      showAlert();
      return;
    }

    try {
      const response = await axios.patch<UpdatePasswordResponse>(
        "http://localhost:3100/api/v1/users/update-password",
        {
          oldpassword: oldPassword,
          newpassword: newPassword,
        },
        { withCredentials: true }
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
          Enter Old Password:
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Enter New Password:
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Confirm New Password:
          <input
            type="password"
            placeholder="Confirm New Password"
            value={cPassword}
            onChange={(e) => setCPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <button onClick={updatePassword}>Update Password</button>
    </>
  );
};
