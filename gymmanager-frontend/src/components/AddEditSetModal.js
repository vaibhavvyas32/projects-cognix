"use client";
import React, { useState, useEffect } from "react";
import { fetchUserExercisesForUser, createSet, updateSet } from "../api";
import "../App.css"; // Assuming modal styles will be in App.css or a new file

const AddEditSetModal = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  initialData,
  userId,
  defaultUserExerciseId,
  defaultDay,
}) => {
  const [userExercises, setUserExercises] = useState([]);
  const [selectedUserExerciseId, setSelectedUserExerciseId] = useState("");
  const [day, setDay] = useState(new Date().toISOString().split("T")[0]);
  const [setCounts, setSetCounts] = useState("");
  const [repCounts, setRepCounts] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && userId) {
      const loadUserExercises = async () => {
        try {
          const response = await fetchUserExercisesForUser(userId);
          setUserExercises(response.data || []);

          if (initialData) {
            // Editing an existing set
            setSelectedUserExerciseId(initialData.user_exercise?.id || "");
            setDay(initialData.day || new Date().toISOString().split("T")[0]);
            setSetCounts(initialData.set_counts || "");
            setRepCounts(initialData.rep_counts || "");
          } else {
            // Adding a new set, use defaults if provided
            setSelectedUserExerciseId(defaultUserExerciseId || "");
            setDay(defaultDay || new Date().toISOString().split("T")[0]);
            setSetCounts("");
            setRepCounts("");
          }
        } catch (err) {
          setError("Failed to load exercises for dropdown. " + err.message);
          setUserExercises([]); // Clear exercises on error too
        }
      };
      loadUserExercises();
    } else if (!isOpen) {
      // Reset all form fields and error when modal is closed
      setSelectedUserExerciseId("");
      setDay(new Date().toISOString().split("T")[0]); // Reset day to today
      setSetCounts("");
      setRepCounts("");
      setError("");
      setUserExercises([]); // Clear user exercises list as well
    } else if (isOpen && !userId && !initialData) {
      // If modal is open but no userId (e.g. user logs out while modal is open for new entry)
      // and not editing, reset to avoid issues.
      setSelectedUserExerciseId(defaultUserExerciseId || ""); // or just ""
      setDay(defaultDay || new Date().toISOString().split("T")[0]); // or just today
      setSetCounts("");
      setRepCounts("");
      setError("User not available. Please ensure you are logged in.");
      setUserExercises([]);
    }
  }, [isOpen, userId, initialData, defaultUserExerciseId, defaultDay]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserExerciseId) {
      setError("Please select an exercise.");
      return;
    }
    setIsLoading(true);
    setError("");
    const setData = {
      user_exercise_id: selectedUserExerciseId,
      day,
      set_counts: parseInt(setCounts, 10),
      rep_counts: parseInt(repCounts, 10),
    };

    try {
      if (initialData && initialData.id) {
        await updateSet(initialData.id, setData);
      } else {
        await createSet(setData);
      }
      onSubmitSuccess();
      onClose();
    } catch (err) {
      setError(
        "Failed to save set. " +
          (err.response?.data?.detail ||
            err.response?.data?.user_exercise_id?.[0] ||
            err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{initialData ? "Edit Set" : "Add New Set"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userExercise">Exercise:</label>
            <select
              id="userExercise"
              value={selectedUserExerciseId}
              onChange={(e) => setSelectedUserExerciseId(e.target.value)}
              required
              disabled={!!defaultUserExerciseId}
            >
              <option value="" disabled>
                Select an exercise
              </option>
              {userExercises.map((ue) => (
                <option key={ue.id} value={ue.id}>
                  {ue.exercise.name} (User: {ue.user.username})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="day">Day:</label>
            <input
              type="date"
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="setCounts">Set Counts:</label>
            <input
              type="number"
              id="setCounts"
              value={setCounts}
              onChange={(e) => setSetCounts(e.target.value)}
              required
              min="1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="repCounts">Rep Counts:</label>
            <input
              type="number"
              id="repCounts"
              value={repCounts}
              onChange={(e) => setRepCounts(e.target.value)}
              required
              min="1"
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="modal-actions">
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Saving..." : "Save Set"}
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

export default AddEditSetModal;
