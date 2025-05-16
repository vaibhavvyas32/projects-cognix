"use client";

import React, { useEffect, useState } from "react";
import { fetchSets, deleteSet } from "../api";
import AddEditSetModal from "./AddEditSetModal";
import "../App.css";

const SetList = ({ userId }) => {
  const [sets, setSets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSet, setEditingSet] = useState(null);

  const loadSets = async () => {
    if (!userId) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await fetchSets(userId);
      setSets(response.data || []);
    } catch (err) {
      setError(
        "Failed to load sets. " + (err.response?.data?.detail || err.message)
      );
      setSets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSets();
  }, [userId]);

  const handleAddSet = () => {
    setEditingSet(null);
    setIsModalOpen(true);
  };

  const handleEditSet = (set) => {
    setEditingSet(set);
    setIsModalOpen(true);
  };

  const handleDeleteSet = async (setId) => {
    if (window.confirm("Are you sure you want to delete this set?")) {
      try {
        await deleteSet(setId);
        loadSets();
      } catch (err) {
        alert(
          "Failed to delete set: " + (err.response?.data?.detail || err.message)
        );
      }
    }
  };

  const handleModalSubmitSuccess = () => {
    loadSets();
  };

  if (isLoading) return <p>Loading sets...</p>;
  if (error && sets.length === 0)
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
        <h2>Sets</h2>
        <button onClick={handleAddSet} className="btn-primary">
          Add New Set
        </button>
      </div>
      {error && sets.length > 0 && (
        <p className="form-error" style={{ marginBottom: "10px" }}>
          Error fetching latest sets: {error}
        </p>
      )}
      {sets.length === 0 && !isLoading && !error && (
        <p>No sets recorded yet. Click &quot;Add New Set&quot; to begin.</p>
      )}
      {sets.length > 0 && (
        <ul>
          {sets.map((set) => (
            <li
              key={set.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div>
                <strong>
                  {set.user_exercise?.exercise?.name || "Exercise N/A"}
                </strong>{" "}
                on {set.day} <br />
                Sets: {set.set_counts}, Reps: {set.rep_counts}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleEditSet(set)}
                  className="btn-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSet(set.id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <AddEditSetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleModalSubmitSuccess}
        initialData={editingSet}
        userId={userId}
      />
    </div>
  );
};

export default SetList;
