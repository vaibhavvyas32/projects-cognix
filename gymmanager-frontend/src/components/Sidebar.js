"use client";
import React from "react";
import "../App.css"; // Assuming styles will be in App.css or a new file

// If you add actual icons later (e.g., from react-icons):
// import { RiLogoutBoxRLine } from 'react-icons/ri'; // Example

const Sidebar = ({ isOpen, onClose, onLogout, username }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose}></div>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h4 style={{ fontWeight: 700, fontSize: "1.2rem", margin: 0 }}>
            Hi, {username}!
          </h4>
          <button onClick={onClose} className="sidebar-close-btn">
            &times;
          </button>
        </div>
        {/* Navigation can be added back here if needed */}
        {/* <nav className="sidebar-nav">
          <ul>
            <li><a href="#" onClick={onClose}>Dashboard</a></li>
            <li><a href="#" onClick={onClose}>My Profile</a></li>
          </ul>
        </nav> */}
        <div className="sidebar-footer">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="logout-btn-sidebar"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
