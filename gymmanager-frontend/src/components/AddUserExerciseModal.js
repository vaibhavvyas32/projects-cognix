"use client";
import React, { useState, useEffect } from "react";
import {
  fetchExercises,
  addUserExercise,
  fetchUserExercisesForUser,
} from "../api";
import "../App.css";

const AddUserExerciseModal = ({ isOpen, onClose, onSubmitSuccess, userId }) => {
  const [globalExercises, setGlobalExercises] = useState([]);
  const [userExistingExerciseIds, setUserExistingExerciseIds] = useState(
    new Set()
  );
  const [selectedExerciseIds, setSelectedExerciseIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && userId) {
      setIsLoading(true);
      setError("");
      Promise.all([fetchExercises(), fetchUserExercisesForUser(userId)])
        .then(([globalRes, userExercisesRes]) => {
          setGlobalExercises(globalRes.data || []);
          const existingIds = new Set(
            (userExercisesRes.data || []).map((ue) => ue.exercise.id)
          );
          setUserExistingExerciseIds(existingIds);
          setSelectedExerciseIds(new Set()); // Reset selection
        })
        .catch((err) => {
          setError(
            "Failed to load exercises. " + (err.message || "Unknown error")
          );
          setGlobalExercises([]);
          setUserExistingExerciseIds(new Set());
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, userId]);

  const handleCheckboxChange = (exerciseId) => {
    setSelectedExerciseIds((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(exerciseId)) {
        newSelection.delete(exerciseId);
      } else {
        newSelection.add(exerciseId);
      }
      return newSelection;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedExerciseIds.size === 0) {
      setError("Please select at least one exercise to add.");
      return;
    }
    setIsLoading(true);
    setError("");

    const promises = Array.from(selectedExerciseIds).map((exerciseId) =>
      addUserExercise({ user_id: userId, exercise_id: exerciseId })
    );

    try {
      await Promise.all(promises);
      onSubmitSuccess();
      onClose();
    } catch (err) {
      setError(
        "Failed to add exercises. " +
          (err.response?.data?.detail || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filter out exercises already added by the user
  const availableExercises = globalExercises.filter(
    (ex) => !userExistingExerciseIds.has(ex.id)
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "500px" }}>
        <h3>Add Exercises to Your List</h3>
        {isLoading && <p>Loading exercises...</p>}
        {error && (
          <div className="form-error" style={{ marginBottom: "15px" }}>
            {error}
          </div>
        )}
        {!isLoading && !error && availableExercises.length === 0 && (
          <p>
            All available exercises have been added, or no global exercises
            exist.
          </p>
        )}
        {!isLoading && !error && availableExercises.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div
              className="form-group"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              {availableExercises.map((exercise) => (
                <div key={exercise.id} style={{ marginBottom: "8px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExerciseIds.has(exercise.id)}
                      onChange={() => handleCheckboxChange(exercise.id)}
                      style={{ marginRight: "10px", width: "auto" }}
                    />
                    {exercise.name}
                  </label>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button
                type="submit"
                disabled={isLoading || selectedExerciseIds.size === 0}
                className="btn-primary"
              >
                {isLoading
                  ? "Adding..."
                  : `Add Selected (${selectedExerciseIds.size})`}
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
        )}
      </div>
    </div>
  );
};

export default AddUserExerciseModal;
