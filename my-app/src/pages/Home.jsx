import React from "react";
import "./Home.css";
import NavbarSide from "../components/SlidingPane";
import { useState } from "react"
import { useTimer } from "../hooks/useTimer"

// const Home = () => {
//     return (
//         <div className="page-container">
//             <NavbarSide />
//         </div>
//     )
// }



// export default Login


// export default Home;


// import React, { useState } from 'react';
// import { useTimer } from './useTimer';

const Home = () => {
  const { timer, isLoading, error } = useTimer();
  const [duration, setDuration] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [marineType, setMarineType] = useState('');
  const userID = 'boom' // Replace with dynamic user ID retrieval

  const startTimer = async () => {
    if (!duration || duration <= 0) {
      alert('Please enter a valid focus time!');
      return;
    }

    const sessionCreated = await timer(userID, duration, marineType);
    if (sessionCreated) {
      setTimeLeft(duration * 60); // Convert minutes to seconds
      setIsActive(true);
    }
  };

  React.useEffect(() => {
    let timerInterval = null;

    if (isActive && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(timerInterval);
      alert('Focus time is over!');
    }

    return () => clearInterval(timerInterval); // Cleanup interval
  }, [isActive, timeLeft]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Focus Timer</h2>

      <div>
        <label>
          Focus Duration (minutes):{' '}
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            disabled={isActive}
          />
        </label>
      </div>

      <div>
        <label>
          Marine Type: {' '}
          <input
            type="text"
            value={marineType}
            onChange={(e) => setMarineType(e.target.value)}
            disabled={isActive}
          />
        </label>
      </div>

      <button
        onClick={startTimer}
        disabled={isLoading || isActive}
        style={{
          backgroundColor: isActive ? 'gray' : '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          cursor: isActive ? 'not-allowed' : 'pointer',
        }}
      >
        {isActive ? 'Timer Running...' : 'Start Timer'}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {isActive && (
        <div style={{ marginTop: '20px' }}>
          <h3>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</h3>
        </div>
      )}
      <div className="page-container">
          <NavbarSide />
      </div>
    </div>
  );
};

export default Home;