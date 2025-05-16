"use client";

import React, { useEffect, useState } from "react";
import { fetchUserDetails } from "../api";
import EditUserDetailsModal from "./EditUserDetailsModal";
import "../App.css";

const UserDetailsList = ({ userId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadUserDetails = async () => {
    if (!userId) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await fetchUserDetails(userId);
      setUserDetails(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setUserDetails(null);
        setError("");
      } else {
        setError(
          "Failed to load user details. " +
            (err.response?.data?.detail || err.message)
        );
        setUserDetails(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, [userId]);

  const handleEditDetails = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmitSuccess = () => {
    loadUserDetails();
  };

  if (isLoading) return <p>Loading user details...</p>;
  if (error && !userDetails)
    return <p className="form-error">Error: {error}</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h2>User Details</h2>
        <button onClick={handleEditDetails} className="btn-primary">
          {userDetails ? "Edit Details" : "Add Details"}
        </button>
      </div>

      {userDetails ? (
        <ul>
          <li key={userDetails.user.id}>
            <strong>Full Name:</strong> {userDetails.full_name || "N/A"}
            <br />
            <strong>Weight:</strong>{" "}
            {userDetails.weight ? `${userDetails.weight} kg` : "N/A"}
            <br />
            <strong>Height:</strong> {userDetails.height || "N/A"}
          </li>
        </ul>
      ) : (
        <p>No details found. Click &quot;Add Details&quot; to create them.</p>
      )}

      <EditUserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleModalSubmitSuccess}
        initialDetails={userDetails}
        userId={userId}
      />
    </div>
  );
};

export default UserDetailsList;
