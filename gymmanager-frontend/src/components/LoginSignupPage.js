import React, { useState, useEffect } from "react";
import { loginUser, signupUser } from "../api";
import "../App.css";

const LoginSignupPage = ({ onLogin }) => {
  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-fade error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let user;
      if (tab === "login") {
        user = await loginUser(username, password);
      } else {
        user = await signupUser(username, password);
      }
      onLogin(user);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-signup-container">
      <div className="app-title">
        <span className="app-title-emoji" role="img" aria-label="gym rod">
          🏋️‍♂️
        </span>
        Gym Manager
      </div>
      <div className="login-signup-card">
        <div className="login-signup-tabs">
          <button
            className={tab === "login" ? "active" : ""}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={tab === "signup" ? "active" : ""}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="form-error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : tab === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginSignupPage;
