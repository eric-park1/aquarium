import React from "react";
import "./Landing.css";
import LoginSignup from "./UserAuth/LoginSignup"

const Landing = () => {
    return (
        <div className="landing-container">
          <div className="left-side">
            {/* You can add content for the left side here */}
            <h1>Welcome to Our Application</h1>
            <p>Discover amazing features by signing up or logging in.</p>
          </div>
          <div className="right-side">
            <LoginSignup />
          </div>
        </div>
    );
};

export default Landing;