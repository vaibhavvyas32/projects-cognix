import React from "react";
import styles from "./styles.module.css";

const Dashboard = ({ user, userDetails }) => {
  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase() ||
      user?.username?.[0]?.toUpperCase() ||
      "?"
    );
  };

  return (
    <div className={styles["dashboard"]}>
      <div className={styles["dashboard-header"]}>
        <div className={styles["avatar"]}>
          <span className={styles["avatar-text"]}>
            {getInitials(userDetails?.full_name)}
          </span>
        </div>
        <div className={styles["user-info"]}>
          <h2 className={styles["user-name"]}>
            {userDetails?.full_name || user?.username}
          </h2>
          <p className={styles["user-username"]}>@{user?.username}</p>
        </div>
      </div>

      {userDetails && (
        <div className={styles["user-stats"]}>
          <div className={styles["stat-item"]}>
            <span className={styles["stat-label"]}>Height</span>
            <span className={styles["stat-value"]}>
              {userDetails.height || "Not set"}
            </span>
          </div>
          <div className={styles["stat-item"]}>
            <span className={styles["stat-label"]}>Weight</span>
            <span className={styles["stat-value"]}>
              {userDetails.weight ? `${userDetails.weight} kg` : "Not set"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
