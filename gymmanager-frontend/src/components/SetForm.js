import React from "react";
import styles from "./styles.module.css";

const SetForm = ({
  form,
  exercises,
  editingId,
  handleChange,
  handleSubmit,
  handleCancel,
}) => {
  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal"]}>
        <form onSubmit={handleSubmit} className={styles["form"]}>
          <h3 className={styles["title"]}>
            {editingId ? "Edit Set" : "Add New Set"}
          </h3>

          <div className={styles["form-group"]}>
            <label className={styles["label"]}>Exercise</label>
            <select
              name="exercise"
              value={form.exercise}
              onChange={handleChange}
              required
              className={styles["select"]}
            >
              <option value="">Select Exercise</option>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["label"]}>Date</label>
            <input
              name="day"
              type="date"
              value={form.day}
              onChange={handleChange}
              required
              className={styles["input"]}
            />
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["label"]}>Sets</label>
            <input
              name="set_counts"
              type="number"
              min="1"
              value={form.set_counts}
              onChange={handleChange}
              required
              className={styles["input"]}
              placeholder="Number of sets"
            />
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["label"]}>Reps</label>
            <input
              name="rep_counts"
              type="number"
              min="1"
              value={form.rep_counts}
              onChange={handleChange}
              required
              className={styles["input"]}
              placeholder="Reps per set"
            />
          </div>

          <div className={styles["form-footer"]}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles["cancel-button"]}
            >
              Cancel
            </button>
            <button type="submit" className={styles["submit-button"]}>
              {editingId ? "Update" : "Add"} Set
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetForm;
