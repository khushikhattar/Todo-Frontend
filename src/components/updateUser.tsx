import React, { useState } from "react";
import axios, { AxiosError } from "axios";

interface UpdateData {
  identifier: string;
}

interface UpdateResponse {
  message: string;
}

export const UpdateUser: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const updateUser = async () => {
    const data: UpdateData = { identifier };

    try {
      const response = await axios.patch<UpdateResponse>(
        "http://localhost:3100/api/v1/users/update",
        data
      );
      setMessage(response.data.message || "Update successful");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        setMessage(axiosError.response?.data?.message || "Update failed");
      } else {
        setMessage("An unexpected error occurred");
      }
    }

    showAlert();
  };

  const showAlert = () => {
    if (message) {
      alert(message);
    }
  };

  return (
    <div>
      <div>
        <label>
          Enter new Username or Email:
          <input
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </label>
      </div>
      <button onClick={updateUser}>Update</button>
    </div>
  );
};
