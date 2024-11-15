import React, { useState } from "react";
import "./LoginSignup.css";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

import user_icon from "../../assets/user-account.png";
import user_email from "../../assets/mail.png";
import user_password from "../../assets/padlock.png";


const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    try {
      const response = await API.post("/auth/login", { username, password });
      document.cookie = `jwt=${response.data.token}; path=/; Secure; HttpOnly`;
      //localStorage.setItem("token", response.data.token);
      navigate('/home', { replace: true });
      alert("Login successful!");
    } catch (error) {
      setError(error.response?.data?.error || "An unknown error occurred.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    try {
      const response = await API.post("/api/authRoutes/signup", { email, password });
      if (response.status === 201 && response.data.user) {
        setSuccess(true); // Update state to show success
        console.log('Signup successful:', response.data); // Log the response
        navigate('/home', { replace: true });
      }
    } catch (error) {
      if (err.response && err.response.data.errors) {
        setError(err.response.data.errors); // Display specific error from backend
      } else {
        setError('An error occurred. Please try again.'); // Generic error message
      }
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="login-signup-container">
      <div className="log-sign-header">
        <div className="log-sign-text">{action === "Login" ? "Log In" : "Sign Up"}</div>
        <div className="log-sign-underline"></div>
      </div>

      {/* Link to switch to Sign Up */}
      <div className="create-account"> 
        {action === "Login" ? (
          <>
            Don't have an account? <span onClick={() => setAction("Sign Up")}>Create an account</span>
          </>
        ) : (
          <>
            Already have an account? <span onClick={() => setAction("Login")}>Log In</span>
          </>
        )}
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

        <button type="submit" className="submit-button">
          {action === "Login" ? "Login" : "Sign Up"}
        </button>
      </form>

      {/* Conditional display for Forgot Password link */}
      {action === "Login" && (
        <div className="forgot-password">
          Forgot your password? <span>Click Here</span>
        </div>
      )}
    </div>
  );
};

export default LoginSignup;

