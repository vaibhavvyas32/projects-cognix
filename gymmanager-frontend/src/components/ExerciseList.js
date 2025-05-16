"use client";

import React, { useEffect, useState } from "react";
import { fetchUserExercisesForUser, removeUserExercise } from "../api";
import AddUserExerciseModal from "./AddUserExerciseModal";
import "../App.css";

const ExerciseList = ({ userId }) => {
  const [userExercises, setUserExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadUserExercises = async () => {
    if (!userId) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await fetchUserExercisesForUser(userId);
      setUserExercises(response.data || []);
    } catch (err) {
      setError(
        "Failed to load your exercises. " +
          (err.response?.data?.detail || err.message)
      );
      setUserExercises([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserExercises();
  }, [userId]);

  const handleRemoveUserExercise = async (userExerciseId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this exercise from your list?"
      )
    ) {
      try {
        await removeUserExercise(userExerciseId);
        loadUserExercises(); // Refresh the list
      } catch (err) {
        alert(
          "Failed to remove exercise: " +
            (err.response?.data?.detail || err.message)
        );
      }
    }
  };

  const handleModalSubmitSuccess = () => {
    loadUserExercises(); // Refresh after adding new exercises
  };

  if (isLoading) return <p>Loading your exercises...</p>;
  if (error && userExercises.length === 0)
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
        <h2>Your Exercises</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          Add Exercise to List
        </button>
      </div>
      {error && userExercises.length > 0 && (
        <p className="form-error" style={{ marginBottom: "10px" }}>
          Error fetching latest exercises: {error}
        </p>
      )}
      {userExercises.length === 0 && !isLoading && !error && (
        <p>
          You haven&apos;t added any exercises to your list yet. Click &quot;Add
          Exercise to List&quot; to browse.
        </p>
      )}
      {userExercises.length > 0 && (
        <ul>
          {userExercises.map((ue) => (
            <li
              key={ue.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div>
                <strong>{ue.exercise.name}</strong> - {ue.exercise.description}
              </div>
              <button
                onClick={() => handleRemoveUserExercise(ue.id)}
                className="btn-danger"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <AddUserExerciseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleModalSubmitSuccess}
        userId={userId}
      />
    </div>
  );
};

export default ExerciseList;
