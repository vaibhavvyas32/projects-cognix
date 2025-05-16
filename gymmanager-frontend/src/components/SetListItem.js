import React from "react";
import styles from "./styles.module.css";

const SetListItem = ({ set, onEdit, onDelete }) => (
  <li className={styles["list-item"]}>
    <div className={styles["item-content"]}>
      <div className={styles["exercise-name"]}>
        {set.user_exercise.exercise.name}
      </div>
      <div className={styles["exercise-details"]}>
        By {set.user_exercise.user.username} • {set.day} •{set.set_counts} sets
        • {set.rep_counts} reps
      </div>
    </div>
    <div className={styles["action-buttons"]}>
      <button className={styles["edit-button"]} onClick={() => onEdit(set)}>
        Edit
      </button>
      <button
        className={styles["delete-button"]}
        onClick={() => onDelete(set.id)}
      >
        Delete
      </button>
    </div>
  </li>
);

export default SetListItem;
