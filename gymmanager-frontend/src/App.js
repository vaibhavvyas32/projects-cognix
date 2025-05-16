"use client";
import React, { useEffect, useState } from "react";
import UserDetailsList from "./components/UserDetailsList";
import ExerciseList from "./components/ExerciseList";
import SetList from "./components/SetList";
import DayOfExerciseList from "./components/DayOfExerciseList";
import LoginSignupPage from "./components/LoginSignupPage";
import Sidebar from "./components/Sidebar";
import "./App.css";

// Placeholder icons - ideally use an icon library like react-icons
const SunIcon = () => <span>☀️</span>; // Replace with actual icon from library
const MoonIcon = () => <span>🌙</span>; // Replace with actual icon from library
const BurgerIcon = () => <span>☰</span>; // Replace with actual icon from library

const App = () => {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("gymjao_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    // Optional: load theme preference from localStorage too
    const savedTheme = localStorage.getItem("gymjao_theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("gymjao_theme", theme); // Save theme preference
  }, [theme]);

  const handleLogin = (userObj) => {
    setUser(userObj);
    localStorage.setItem("gymjao_user", JSON.stringify(userObj));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("gymjao_user");
    setIsSidebarOpen(false); // Close sidebar on logout
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return (
      <div className="App">
        {/* Theme toggle can be shown on login page too */}
        <button
          className="theme-toggle-icon-btn"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
        <LoginSignupPage onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="App">
      <button
        className="burger-menu-btn"
        onClick={toggleSidebar}
        title="Open Menu"
      >
        <BurgerIcon />
      </button>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        onLogout={handleLogout}
        username={user.username}
      />
      <button
        className="theme-toggle-icon-btn"
        onClick={toggleTheme}
        title="Toggle Theme"
      >
        {theme === "light" ? <MoonIcon /> : <SunIcon />}
      </button>

      {/* App title with gym emoji */}
      <div className="app-title">
        <span className="app-title-emoji" role="img" aria-label="gym rod">
          🏋️‍♂️
        </span>
        Gym Manager
      </div>

      {/* Dashboard grid layout */}
      <div className="dashboard-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div className="dashboard-card">
            <h2>User Details</h2>
            <UserDetailsList userId={user.id} />
          </div>
          <div className="dashboard-card">
            <h2>Sets</h2>
            <SetList userId={user.id} />
          </div>
        </div>
        <div>
          <div className="dashboard-card">
            <h2>Workout Days</h2>
            <DayOfExerciseList userId={user.id} />
          </div>
        </div>
        <div>
          <div className="dashboard-card">
            <h2>Your Exercises</h2>
            <ExerciseList userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
