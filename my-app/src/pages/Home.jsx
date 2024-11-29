import React, { useState, useRef, useEffect } from "react";
import NavbarSide from "../components/SlidingPane";

import { useTimer } from "../hooks/useTimer"


const CountdownTimer = () => {
  // Reference to track interval ID
  const Ref = useRef(null);

  // State variables
  const [timer, setTimer] = useState("00:00:00");
  const [marineType, setMarineType] = useState('');
  const [duration, setDuration] = useState('');
  const [isActive, setIsActive] = useState(false);
  const { session, isLoading, error } = useTimer();

  // Function to calculate time remaining
  const getTimeRemaining = (endTime) => {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  // Function to start the timer countdown
  const startTimer = (endTime) => {
    const { total, hours, minutes, seconds } = getTimeRemaining(endTime);
    if (total >= 0) {
      //session(total, marineType)
      setTimer(
        `${hours > 9 ? hours : "0" + hours}:${
          minutes > 9 ? minutes : "0" + minutes
        }:${seconds > 9 ? seconds : "0" + seconds}`
      );
    } else {
      clearInterval(Ref.current);
      setIsActive(false);
      session(total, marineType, true);
      alert("Time's up!");
    }
  };

  // Function to clear and reset the timer
  const clearTimer = (endTime) => {
    if (Ref.current) clearInterval(Ref.current);
    setTimer(`${duration.padStart(2, "0")}:00:00`);
    const id = setInterval(() => {
      startTimer(endTime);
    }, 1000);
    Ref.current = id;
  };

  // Function to calculate the deadline based on user input
  const getDeadTime = () => {
    const deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + parseInt(duration, 10));
    return deadline;
  };

  // Function to handle timer start
  const handleStart = () => {
    if (!duration || isNaN(duration) || duration <= 0) {
      alert("Please enter a valid duration in minutes.");
      return;
    }
    setIsActive(true);
    
    //session(duration, marineType)
    clearTimer(getDeadTime());
    
  };

  return (
    <div style={{ textAlign: "center", margin: "auto", fontFamily: "Arial" }}>
      <label>
        Focus Duration (minutes):{" "}
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          disabled={isActive}
        />
      </label>
      <label>
          Marine Type: {' '}
        <input
          type="text"
          value={marineType}
          onChange={(e) => setMarineType(e.target.value)}
          disabled={isActive}
        />
      </label>
      <h2>{timer}</h2>
      <button
        onClick={handleStart}
        disabled={isActive}
        style={{
          margin: "10px",
          padding: "10px 20px",
          backgroundColor: isActive ? "gray" : "#007bff",
          color: "white",
          border: "none",
          cursor: isActive ? "not-allowed" : "pointer",
        }}
      >
        {isActive ? "Timer Running..." : "Start Timer"}
      </button>
      <div className="page-container">
           <NavbarSide />
      </div>
    </div>
  );
};

export default CountdownTimer;
