import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useSignup } from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";


import user_icon from "../assets/user-account.png";
import user_email from "../assets/mail.png";
import user_password from "../assets/padlock.png";

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To display error messages
  const { login, isLoading: isLoginLoading } = useLogin();
  const { signup, isLoading: isSignupLoading } = useSignup();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/"); // Redirect to home page after successful login
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const success = await signup(email, password);
      if (success) {
        navigate("/"); // Redirect to home page after successful signup
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="login-signup-container">
      <div className="log-sign-header">
        <div className="log-sign-text">{action === "Login" ? "Log In" : "Sign Up"}</div>
        <div className="log-sign-underline"></div>
      </div>

      <div className="create-account">
        {action === "Login" ? (
          <>
            Don't have an account?{" "}
            <span onClick={() => setAction("Sign Up")}>Create an account</span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span onClick={() => setAction("Login")}>Log In</span>
          </>
        )}
      </div>

      <form
        onSubmit={action === "Login" ? handleLogin : handleSignup}
        className="log-sign-inputs"
      >
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

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="submit-button"
          disabled={action === "Login" ? isLoginLoading : isSignupLoading}
        >
          {action === "Login" ? "Login" : "Sign Up"}
        </button>
      </form>

      {action === "Login" && (
        <div className="forgot-password">
          Forgot your password? <span>Click Here</span>
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
