"use client";
import React, { useState, useEffect } from "react";
import { updateUserDetails, createUserDetails } from "../api";
import "../App.css";

const EditUserDetailsModal = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  initialDetails,
  userId,
}) => {
  const [fullName, setFullName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialDetails) {
        setFullName(initialDetails.full_name || "");
        setWeight(initialDetails.weight || "");
        setHeight(initialDetails.height || "");
      } else {
        // Reset for new entry if no initial details (though typically we edit existing)
        setFullName("");
        setWeight("");
        setHeight("");
      }
      setError(""); // Clear previous errors when modal opens
    }
  }, [isOpen, initialDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const detailsPayload = {
      full_name: fullName,
      ...(weight && { weight: parseFloat(weight) }),
      ...(height && { height }),
    };

    try {
      if (initialDetails && initialDetails.user) {
        await updateUserDetails(userId, detailsPayload);
      } else {
        await createUserDetails({ ...detailsPayload, user: userId });
      }
      onSubmitSuccess();
      onClose();
    } catch (err) {
      let errorMessage = "Failed to save details.";
      if (err.response && err.response.data) {
        const errors = err.response.data;
        if (typeof errors === "string") {
          errorMessage += " " + errors;
        } else if (errors.full_name) {
          errorMessage += " Full Name: " + errors.full_name.join(" ");
        } else if (errors.user) {
          errorMessage += " User association: " + errors.user.join(" ");
        } else {
          errorMessage += " " + JSON.stringify(errors);
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>
          {initialDetails && initialDetails.user
            ? "Edit User Details"
            : "Add User Details"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="weight">Weight (kg):</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 70.5"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="height">Height (cm or ft/in):</label>
            <input
              type="text" // Text to allow various formats like 175cm or 5ft 9in
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g., 175cm or 5ft 9in"
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="modal-actions">
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Saving..." : "Save Details"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetailsModal;
