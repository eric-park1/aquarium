//import React, { useState, useRef, useEffect } from "react";
import NavbarSide from "../components/SlidingPane";
import BarChartComponent from "../components/ChartSession";

import { useState, useEffect } from 'react'
import fish from "../assets/fish.png";


//get array of session in each tank
async function getAllSessions(email) {
  //gets user schema data
  try {
    const userFromEmail = await fetch(`/api/user/email/${email}`);
    if (!userFromEmail.ok) {
      throw new Error("Failed to fetch user data with id ${email}");
    }
    const userData = await userFromEmail.json();
    if (!userData) {
      console.log('your mom')
    }

    //after successfully getting user data, get user.aquarium, which is the corresponding tank schema data
    const tankPromises = userData.aquarium.map(async (tankId) => {
      try {
        const response = await fetch(`/api/user/tank/${tankId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch tank with ID: ${tankId}`);
        }
        return response.json();
      } catch (error) {
        console.error(`Error getting tank data for ID: ${tankId}`, error);
        return null; 
      }
    });

    const tankDataArray = (await Promise.all(tankPromises)).filter((tank) => tank !== null);

    //after succesfully getting tank data, get the corresponding tank.organims which is the session schema data
    const sessionArrays = await Promise.all(
      tankDataArray.map(async (tank) => {
        if (tank.organism && Array.isArray(tank.organism)) {
          const sessionPromises = tank.organism.map(async (sessionId) => {
            try {
              const response = await fetch(`/api/user/session/${sessionId}`);
              if (!response.ok) {
                throw new Error(`Failed to fetch session with ID: ${sessionId}`);
              }
              return response.json();
            } catch (error) {
              console.error(`Error fetching session data for ID: ${sessionId}`, error);
              return null;
            }
          });

          //wait until all promises are resolved
          const resolvedSessions = await Promise.all(sessionPromises);
          return resolvedSessions.filter((session) => session !== null);
        } else {
          return []; // If no sessions, return an empty array
        }
      })
    );
    console.log(tankDataArray);
    console.log(sessionArrays);

    return {
      tankDataArray,
      sessionArrays,
    }; //tankDataArray is an array of each tank schema, and sessionArrays is an array of arrays
  } catch (error) {
    console.error("Error fetching tanks and sessions", error);
    throw error; // Re-throw the error to handle it outside
  }

};





const Tanks = () => {
  const [tankArray, setTankArray] = useState(null);
  const [sessionArray, setSessionArray] = useState(null);

  const rows = 8; 
  const columns = 8;
  let n = 0;

  useEffect(() => {
    let email = null;
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        email = parsedUser.email;
        getAllSessions(email).then((data) => {
          setTankArray(data.tankDataArray);
          setSessionArray(data.sessionArrays);
        }).catch((error) => {
          console.error("Error fetching session data:", error);
        });
        
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);

  n = sessionArray ? sessionArray.reduce((total, sessions) => total + sessions.length, 0) : 0;

  // Initialize an empty object to group sessions by month and year
  const focusTimeByMonth = {};

  //create an array of arrays, where each array is a 31 length array with focus durations of each day in the month
  if (sessionArray) {
    sessionArray.forEach((sessions) => {
      sessions.forEach((session) => {
        if (session.createdAt && session.duration) {
          const sessionDate = new Date(session.createdAt);
          const year = sessionDate.getFullYear();
          const month = sessionDate.getMonth();
          const day = sessionDate.getDate();

          const key = `${year}-${month}`; // Unique key for each month of a year

          // Initialize the month's array if it doesn't exist
          if (!focusTimeByMonth[key]) {
            focusTimeByMonth[key] = Array(31).fill(0); // Max 31 days per month
          }

          // Accumulate the duration in the corresponding day's index
          focusTimeByMonth[key][day - 1] += session.duration;
        }
      });
    });
  }

  // Convert the focusTimeByMonth object to an array of arrays
  const focusTimeByMonthArray = Object.values(focusTimeByMonth);

  console.log(focusTimeByMonthArray);
  console.log(focusTimeByMonthArray[0]);

  const renderSquare = (row, col, n) => {
    const isBlack = (row + col) % 2 === 1;
    const squareStyle = { 
      backgroundColor: isBlack ? 'black' : 'white',
      width: '50px',
      height: '50px',
      position: 'relative', // Enables positioning for the image
    };
  
    const imageStyle = {
      width: '30px',
      height: '30px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)', // Centers the image
      pointerEvents: 'none', // Ensures the image doesn’t interfere with clicks
    };
  
    // Calculate the index of the current square in a flat array representation
    const index = row * columns + col;
  
    // Render an image if the current index is less than n
    return (
      <div key={`${row}-${col}`} style={squareStyle}>
        {index < n && (
          <img 
            src={fish}
            alt={`square-${row}-${col}`} 
            style={imageStyle} 
          />
        )}
      </div>
    );
  };
  
  const renderRow = (row) => {
    return (
      <div key={row} style={{ display: 'flex' }}>
        {Array.from(Array(columns), (_, col) => renderSquare(row, col, n))}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Navbar */}
      <div style={{ flexShrink: 0 }}>
        <NavbarSide />
      </div>

      <div className="button-bar">
        <button>Button 1</button>
        <button>Button 2</button>
        <button>Button 3</button>
      </div>
  
      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Half: Array */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {tankArray && sessionArray
            ? Array.from(Array(rows), (_, row) => renderRow(row))
            : <p>Loading tank data...</p>}
        </div>
  
        {/* Bottom Half: Chart */}
        <div style={{ flex: 1 }}>
          {focusTimeByMonthArray[0] 
            ? <BarChartComponent dataArray={focusTimeByMonthArray[0]} />
            : <p>Loading chart data...</p>}
        </div>
      </div>
    </div>
  );  
};

export default Tanks;