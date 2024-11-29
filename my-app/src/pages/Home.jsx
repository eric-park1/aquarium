// import React from "react";
// import "./Home.css";
// import NavbarSide from "../components/SlidingPane";
// import { useState } from "react"
// import { useTimer } from "../hooks/useTimer"

// // const Home = () => {
// //     return (
// //         <div className="page-container">
// //             <NavbarSide />
// //         </div>
// //     )
// // }

// // export default Login


// // export default Home;


// // import React, { useState } from 'react';
// // import { useTimer } from './useTimer';

// const Home = () => {
//   const { timer, isLoading, error } = useTimer();
//   const [duration, setDuration] = useState('');
//   const [isActive, setIsActive] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [marineType, setMarineType] = useState('');
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const storedUser = localStorage.getItem("user");
//     // if (storedUser) {
//     //   try {
//     //     setUser(JSON.parse(storedUser));
//     //   } catch (error) {
//     //     console.error("Error parsing user data from localStorage", error);
//     //   }
//     // }
//   //setLoading(false);

// //   if (loading) {
// //     return <div>Loading...</div>; // Show loading state until user data is loaded
// //   }

//   const startTimer = async () => {
//     if (!duration || duration <= 0) {
//       alert('Please enter a valid focus time!');
//       return;
//     }

//     const sessionCreated = await timer(userID, duration, marineType);
//     if (sessionCreated) {
//       setTimeLeft(duration * 60); // Convert minutes to seconds
//       setIsActive(true);
//     }
//   };

//   React.useEffect(() => {
//     let timerInterval = null;

//     if (isActive && timeLeft > 0) {
//       timerInterval = setInterval(() => {
//         setTimeLeft((prevTime) => prevTime - 1);
//       }, 1000);
//     } else if (timeLeft === 0) {
//       setIsActive(false);
//       clearInterval(timerInterval);
//       alert('Focus time is over!');
//     }

//     return () => clearInterval(timerInterval); // Cleanup interval
//   }, [isActive, timeLeft]);

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h2>Focus Timer</h2>

//       <div>
//         <label>
//           Focus Duration (minutes):{' '}
//           <input
//             type="number"
//             value={duration}
//             onChange={(e) => setDuration(e.target.value)}
//             disabled={isActive}
//           />
//         </label>
//       </div>

//       <div>
//         <label>
//           Marine Type: {' '}
//           <input
//             type="text"
//             value={marineType}
//             onChange={(e) => setMarineType(e.target.value)}
//             disabled={isActive}
//           />
//         </label>
//       </div>

//       <button
//         onClick={startTimer}
//         disabled={isLoading || isActive}
//         style={{
//           backgroundColor: isActive ? 'gray' : '#007bff',
//           color: 'white',
//           padding: '10px 20px',
//           border: 'none',
//           cursor: isActive ? 'not-allowed' : 'pointer',
//         }}
//       >
//         {isActive ? 'Timer Running...' : 'Start Timer'}
//       </button>

//       {error && <p style={{ color: 'red' }}>Error: {error}</p>}

//       {isActive && (
//         <div style={{ marginTop: '20px' }}>
//           <h3>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</h3>
//         </div>
//       )}
//       <div className="page-container">
//           <NavbarSide />
//       </div>
//     </div>
//   );
// };

// export default Home;



// //   const { timer, isLoading, error } = useTimer();
// //     const [duration, setDuration] = useState('');
// //     const [isActive, setIsActive] = useState(false);
// //     const [timeLeft, setTimeLeft] = useState(0);
// //     const [marineType, setMarineType] = useState('');
// //     const [user, setUser] = useState(null);
  
// //     // Fetch user from localStorage (if present)
// //     useEffect(() => {
// //       const storedUser = localStorage.getItem("user");
// //       console.log(storedUser)
// //       if (storedUser) {
// //         setUser(JSON.parse(storedUser));
// //       }
// //     }, []);
  
// //     const email = user?.email;
  
// //     // Start the timer on button click
// //     const startTimer = async () => {
// //       if (!duration || duration <= 0) {
// //         alert('Please enter a valid focus time!');
// //         return;
// //       }
  
// //       const sessionCreated = await timer(email, duration, marineType); // Assume timer function handles session creation
// //       if (sessionCreated) {
// //         setTimeLeft(duration * 60); // Set timer in seconds
// //         setIsActive(true); // Start timer
// //       }
// //     };
  
// //     // Timer countdown logic
// //     useEffect(() => {
// //       let timerInterval = null;
  
// //       if (isActive && timeLeft > 0) {
// //         // Timer is running, decrement every second
// //         timerInterval = setInterval(() => {
// //           setTimeLeft((prevTime) => prevTime - 1);
// //         }, 1000);
// //       } else if (timeLeft === 0) {
// //         // Timer has finished
// //         setIsActive(false);
// //         clearInterval(timerInterval);
// //         alert('Focus time is over!');
// //       }
  
// //       return () => clearInterval(timerInterval); // Cleanup interval on unmount or when the timer stops
// //     }, [isActive, timeLeft]);

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
      timerSuccess(true);
      alert("Time's up!");
    }
  };

  const timerSuccess = async (success) => {
    try {
      const response = await fetch("/api/userActions/createSession", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marineType,
          duration,
          success,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send timer result to backend");
      }
      const data = await response.json();
      console.log("Timer result sent successfully:", data);
    } catch (error) {
      console.error("Error sending timer result:", error);
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
    
    session(duration, marineType)
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
    </div>
  );
};

export default CountdownTimer;
