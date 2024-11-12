import React, { useState } from "react";
import "./LoginSignup.css";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

import user_icon from "../../assets/user-account.png";
import user_email from "../../assets/mail.png";
import user_password from "../../assets/padlock.png";

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    try {
      const response = await API.post("/api/auth/login", { username, password });
      localStorage.setItem("token", response.data.token);
      navigate('/home', { replace: true });
      alert("Login successful!");
    } catch (error) {
      setError(error.response?.data?.error || "An unknown error occurred.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    try {
      const response = await API.post("/api/auth/signup", { username, password });
      navigate('/home', { replace: true });
      alert(response.data.message);
    } catch (error) {
      setError(error.response?.data?.error || "An unknown error occurred.");
    }
  };

  return (
    <div className="login-signup-container">
      <div className="log-sign-header">
        <div className="log-sign-text">{action}</div>
        <div className="log-sign-underline"></div>
      </div>

      {/* Form */}
      <form onSubmit={action === "Login" ? handleLogin : handleSignup} className="log-sign-inputs">
        {action === "Sign Up" && (
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
        <div className="input">
          <img src={user_email} alt="" />
          <input
            type="email"
            placeholder="Email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={user_password} alt="" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="error-message">{error}</div>} {/* Display error message */}

        {/* No extra submit button here */}
      </form>

      {/* Conditional display for Forgot Password link */}
      {action === "Login" && (
        <div className="forgot-password">
          Forgot your password? <span>Click Here</span>
        </div>
      )}

      <div className="submit-container">
        <div
          className={action === "Login" ? "submit" : "submit gray"}
          onClick={() => setAction("Login")}
        >
          Login
        </div>
        <div
          className={action === "Sign Up" ? "submit" : "submit gray"}
          onClick={() => setAction("Sign Up")}
        >
          Sign Up
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;