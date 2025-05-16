"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  fetchDaysOfExercise,
  fetchSetsForUserExerciseOnDay,
  deleteSet,
} from "../api";
import AddEditSetModal from "./AddEditSetModal";
import "../App.css";
// We will create and import DayWorkoutLogger later
// import DayWorkoutLogger from "./DayWorkoutLogger";

const DayOfExerciseList = ({ userId }) => {
  const [daysOfExercise, setDaysOfExercise] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(null); // To track which day is expanded/selected

  // State for the AddEditSetModal
  const [isSetModalOpen, setIsSetModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    // Used for ADDING a new set
    userExerciseId: null,
    day: null,
    exerciseName: "",
  });
  const [editingSetData, setEditingSetData] = useState(null); // Used for EDITING an existing set

  const [todaysLoggedSets, setTodaysLoggedSets] = useState({}); // { ueId: [set1, set2], ... }
  const [setsLoading, setSetsLoading] = useState({}); // { ueId: true/false, ... }
  const [setsError, setSetsError] = useState({}); // { ueId: "error message", ... }

  const TODAY_ISO = new Date().toISOString().split("T")[0];

  const loadSetsForUserExercise = useCallback(async (userExerciseId, day) => {
    setSetsLoading((prev) => ({ ...prev, [userExerciseId]: true }));
    setSetsError((prev) => ({ ...prev, [userExerciseId]: "" }));
    try {
      const response = await fetchSetsForUserExerciseOnDay(userExerciseId, day);
      setTodaysLoggedSets((prev) => ({
        ...prev,
        [userExerciseId]: response.data || [],
      }));
    } catch (err) {
      setSetsError((prev) => ({
        ...prev,
        [userExerciseId]:
          "Failed to load sets: " + (err.response?.data?.detail || err.message),
      }));
      setTodaysLoggedSets((prev) => ({ ...prev, [userExerciseId]: [] }));
    } finally {
      setSetsLoading((prev) => ({ ...prev, [userExerciseId]: false }));
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setDaysOfExercise([]);
      setSelectedDay(null);
      setTodaysLoggedSets({});
      return;
    }
    setIsLoading(true);
    setError("");
    const loadDays = async () => {
      try {
        const response = await fetchDaysOfExercise(userId);
        setDaysOfExercise(response.data || []);
      } catch (err) {
        setError(
          "Failed to load days of exercise. " +
            (err.response?.data?.detail || err.message)
        );
        setDaysOfExercise([]);
      }
      setIsLoading(false);
    };
    loadDays();
  }, [userId]);

  useEffect(() => {
    if (selectedDay?.user_exercise) {
      selectedDay.user_exercise.forEach((ue) => {
        // Check if sets for this ue.id on TODAY_ISO are already loaded or loading
        if (!todaysLoggedSets[ue.id] && !setsLoading[ue.id]) {
          loadSetsForUserExercise(ue.id, TODAY_ISO);
        }
      });
    }
  }, [
    selectedDay,
    loadSetsForUserExercise,
    TODAY_ISO,
    todaysLoggedSets,
    setsLoading,
  ]);

  const handleDaySelect = (dayTemplate) => {
    const newSelectedDay =
      selectedDay && selectedDay.id === dayTemplate.id ? null : dayTemplate;
    setSelectedDay(newSelectedDay);
    // if (newSelectedDay) { // Now handled by the useEffect above
    //   newSelectedDay.user_exercise.forEach(ue => {
    //     loadSetsForUserExercise(ue.id, TODAY_ISO);
    //   });
    // }
  };

  const openAddSetModal = (userExercise) => {
    setEditingSetData(null); // Ensure we are in 'add' mode
    setModalConfig({
      userExerciseId: userExercise.id,
      day: TODAY_ISO,
      exerciseName: userExercise.exercise.name,
    });
    setIsSetModalOpen(true);
  };

  const openEditSetModal = (set, userExercise) => {
    setEditingSetData(set); // Set the set to be edited
    setModalConfig({
      // Provide defaults, though initialData will take precedence for form fields
      userExerciseId: userExercise.id,
      day: set.day,
      exerciseName: userExercise.exercise.name,
    });
    setIsSetModalOpen(true);
  };

  const handleModalClose = () => {
    setIsSetModalOpen(false);
    setModalConfig({ userExerciseId: null, day: null, exerciseName: "" });
    setEditingSetData(null);
  };

  const handleSetSubmitSuccess = () => {
    handleModalClose();
    // Refresh sets for the affected userExerciseId and day
    const ueIdToRefresh =
      editingSetData?.user_exercise?.id || modalConfig.userExerciseId;
    const dayToRefresh = editingSetData?.day || modalConfig.day;
    if (ueIdToRefresh && dayToRefresh) {
      // Only refresh if it's for today, as that's what we're displaying primarily
      if (dayToRefresh === TODAY_ISO) {
        loadSetsForUserExercise(ueIdToRefresh, dayToRefresh);
      }
    }
  };

  const handleDeleteSet = async (setIdToDelete, userExerciseId) => {
    if (window.confirm("Are you sure you want to delete this logged set?")) {
      try {
        await deleteSet(setIdToDelete);
        // Refresh the sets for this user exercise for today
        loadSetsForUserExercise(userExerciseId, TODAY_ISO);
      } catch (err) {
        alert(
          "Failed to delete set: " + (err.response?.data?.detail || err.message)
        );
      }
    }
  };

  if (!userId) {
    return <p>Please log in to see your workout days.</p>;
  }
  if (isLoading) return <p>Loading your workout days...</p>;
  if (error && daysOfExercise.length === 0)
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
        <h2>Workout Days</h2>
        {/* TODO: Add button to create/manage DayOfExercise templates */}
        {/* <button className="btn-primary">Manage Workout Day Templates</button> */}
      </div>
      {error && daysOfExercise.length > 0 && (
        <p className="form-error" style={{ marginBottom: "10px" }}>
          Error fetching latest data: {error}
        </p>
      )}

      {daysOfExercise.length === 0 && !isLoading && !error && (
        <p>
          No workout day templates found. You can create them in the management
          section (TODO).
        </p>
      )}

      {daysOfExercise.length > 0 && (
        <ul>
          {daysOfExercise.map((dayTemplate) => (
            <li
              key={dayTemplate.id}
              className="day-template-item"
              onClick={() => handleDaySelect(dayTemplate)}
            >
              <strong>{dayTemplate.day}</strong> (Click to view/log workout)
              {selectedDay && selectedDay.id === dayTemplate.id && (
                <div
                  className="day-workout-details expanded-section"
                  style={{ marginTop: "10px", paddingLeft: "20px" }}
                >
                  <h4>Exercises for {dayTemplate.day}:</h4>
                  {dayTemplate.user_exercise &&
                  dayTemplate.user_exercise.length > 0 ? (
                    <ul>
                      {dayTemplate.user_exercise.map((ue) => (
                        <li
                          key={ue.id}
                          style={{
                            padding: "8px 0",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "5px",
                            }}
                          >
                            <span>
                              <strong>{ue.exercise.name}</strong>
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openAddSetModal(ue);
                              }}
                              className="btn-primary btn-sm"
                              style={{ marginLeft: "10px" }}
                            >
                              Log Performance
                            </button>
                          </div>
                          {/* Display sets logged today */}
                          {setsLoading[ue.id] && (
                            <p style={{ fontSize: "0.8em", color: "gray" }}>
                              Loading sets...
                            </p>
                          )}
                          {setsError[ue.id] && (
                            <p style={{ fontSize: "0.8em", color: "red" }}>
                              {setsError[ue.id]}
                            </p>
                          )}
                          {todaysLoggedSets[ue.id] &&
                            todaysLoggedSets[ue.id].length > 0 && (
                              <div
                                style={{
                                  paddingLeft: "15px",
                                  marginTop: "5px",
                                }}
                              >
                                <strong style={{ fontSize: "0.9em" }}>
                                  Today&apos;s Log:
                                </strong>
                                <ul
                                  style={{
                                    listStyleType: "disc",
                                    paddingLeft: "20px",
                                    fontSize: "0.85em",
                                  }}
                                >
                                  {todaysLoggedSets[ue.id].map((set) => (
                                    <li
                                      key={set.id}
                                      className="logged-set-item"
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "3px 0",
                                      }}
                                    >
                                      <span>
                                        {set.set_counts} sets, {set.rep_counts}{" "}
                                        reps (Logged:{" "}
                                        {new Date(
                                          set.day + "T00:00:00"
                                        ).toLocaleDateString()}
                                        )
                                      </span>
                                      <div>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openEditSetModal(set, ue);
                                          }}
                                          className="btn-secondary btn-xs"
                                          style={{ marginRight: "5px" }}
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteSet(set.id, ue.id);
                                          }}
                                          className="btn-danger btn-xs"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          {todaysLoggedSets[ue.id] &&
                            todaysLoggedSets[ue.id].length === 0 &&
                            !setsLoading[ue.id] &&
                            !setsError[ue.id] && (
                              <p
                                style={{
                                  fontSize: "0.8em",
                                  color: "gray",
                                  paddingLeft: "15px",
                                }}
                              >
                                No performance logged for today yet.
                              </p>
                            )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No exercises assigned to this day template yet.</p>
                  )}
                  {/* Placeholder for DayWorkoutLogger component or direct Set logging integration */}
                  {/* <DayWorkoutLogger dayTemplate={selectedDay} userId={userId} /> */}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {isSetModalOpen && (
        <AddEditSetModal
          isOpen={isSetModalOpen}
          onClose={handleModalClose}
          onSubmitSuccess={handleSetSubmitSuccess}
          initialData={editingSetData} // Pass data for editing, or null for adding
          userId={userId}
          defaultUserExerciseId={modalConfig.userExerciseId} // For adding new, from selected UE
          defaultDay={modalConfig.day} // For adding new, typically today
        />
      )}
    </div>
  );
};

export default DayOfExerciseList;
