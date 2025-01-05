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
      console.log('couldnt get user from email')
    }

    let response = await fetch(`/api/user/daytank/${userData.dayTank}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tank with ID: ${userData.dayTank}`);
    }
    const dayTank = await response.json();

    response = await fetch(`/api/user/weektank/${userData.weekTank}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tank with ID: ${userData.weekTank}`);
    }
    const weekTank = await response.json();

    response = await fetch(`/api/user/monthtank/${userData.monthTank}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tank with ID: ${userData.monthTank}`);
    }
    const monthTank = await response.json();

    response = await fetch(`/api/user/yeartank/${userData.yearTank}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tank with ID: ${userData.yearTank}`);
    }
    const yearTank = await response.json();

    const fetchSessions = async (tank) => {
      if (tank?.focusEvents && Array.isArray(tank.focusEvents)) {
        const sessionPromises = tank.focusEvents.map(async (sessionId) => {
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
        const resolvedSessions = await Promise.all(sessionPromises);
        return resolvedSessions.filter((session) => session !== null);
      }
      return [];
    };
    
    const [daySession, weekSession, monthSession, yearSession] = await Promise.all([
      fetchSessions(dayTank),
      fetchSessions(weekTank),
      fetchSessions(monthTank),
      fetchSessions(yearTank)
    ]);

    return {
      dayTank,
      weekTank,
      monthTank,
      yearTank,
      daySession,
      weekSession,
      monthSession,
      yearSession
    };
  } catch (error) {
    console.error("Error fetching tanks and sessions", error);
    throw error; // Re-throw the error to handle it outside
  }
};

const sessionRecord = (daySessions, weekSessions, monthSessions, yearSessions) => {
  const getStartOfDay = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getStartOfWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay(); // 0 = Sunday
    start.setDate(start.getDate() - day); // Adjust to Sunday
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const fillArray = (sessions, arrayLength, unitInMilliseconds, getIndex, maxValue) => {
    const result = new Array(arrayLength).fill(0);

    sessions.forEach(({ createdAt, duration }) => {
      const startTime = new Date(createdAt);
      let remainingDuration = duration;
      let currentTime = startTime;

      while (remainingDuration > 0) {
        const unitStart = new Date(currentTime);
        unitStart.setMilliseconds(0);
        const unitEnd = new Date(unitStart.getTime() + unitInMilliseconds);

        const index = getIndex(currentTime);
        if (index < 0 || index >= arrayLength) break;

        const timeRemainingInUnit = (unitEnd - currentTime) / (1000 * 60); // Time left in unit in minutes
        const timeToAdd = Math.min(remainingDuration, timeRemainingInUnit);

        result[index] += timeToAdd;
        result[index] = Math.min(result[index], maxValue); // Cap at maxValue

        remainingDuration -= timeToAdd;
        currentTime = new Date(currentTime.getTime() + timeToAdd * 60 * 1000); // Advance time
      }
    });

    return result;
  };

  // Day Array (24 hours, max 60 minutes per hour)
  const dayArray = fillArray(
    daySessions,
    24,
    60 * 60 * 1000, // 1 hour in milliseconds
    (time) => time.getHours(),
    60
  );

  // Week Array (7 days, max 24 hours per day)
  const weekArray = fillArray(
    weekSessions,
    7,
    24 * 60 * 60 * 1000, // 1 day in milliseconds
    (time) => {
      const startOfWeek = getStartOfWeek(time);
      return Math.floor((time - startOfWeek) / (24 * 60 * 60 * 1000));
    },
    24 * 60
  );

  // Month Array (variable days, max 24 hours per day)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const monthArray = fillArray(
    monthSessions,
    daysInMonth,
    24 * 60 * 60 * 1000, // 1 day in milliseconds
    (time) => {
      const startOfMonth = new Date(time.getFullYear(), time.getMonth(), 1);
      return Math.floor((time - startOfMonth) / (24 * 60 * 60 * 1000));
    },
    24 * 60
  );

  // Year Array (12 months, max 744 hours per month (31 days x 24 hours))
  const yearArray = new Array(12).fill(0);
  yearSessions.forEach(({ createdAt, duration }) => {
    const time = new Date(createdAt);
    const monthIndex = time.getMonth();
    yearArray[monthIndex] += duration / 60; // Convert to hours
  });

  yearArray.forEach((hours, index) => {
    yearArray[index] = Math.floor(hours); // Round down to nearest hour
  });

  return { dayArray, weekArray, monthArray, yearArray };
};


const Tanks = () => {
  const [state, setState] = useState({
    dayTank: null,
    weekTank: null,
    monthTank: null,
    yearTank: null,
    daySession: null,
    weekSession: null,
    monthSession: null,
    yearSession: null,
  });

  const [focusTimeByDay, setFocusTimeByDay] = useState([]);
  const [focusTimeByWeek, setFocusTimeByWeek] = useState([]);
  const [focusTimeByMonth, setFocusTimeByMonth] = useState([]);
  const [focusTimeByYear, setFocusTimeByYear] = useState([]);

  const [activeComponent, setActiveComponent] = useState('day'); // Default active component

  const rows = 8; 
  const columns = 8;

  const [n, setN] = useState(0); // Track number of fish to display based on selected view

  // This useEffect fetches the data when the component mounts
  useEffect(() => {
    let email = null;
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        email = parsedUser.email;
        getAllSessions(email).then((data) => {
          const { dayTank, weekTank, monthTank, yearTank, daySession, weekSession, monthSession, yearSession } = data;
          setState({
            dayTank,
            weekTank,
            monthTank,
            yearTank,
            daySession,
            weekSession,
            monthSession,
            yearSession,
          });

          const { dayArray, weekArray, monthArray, yearArray } = sessionRecord(daySession, weekSession, monthSession, yearSession)

          // Set focusTime arrays
          setFocusTimeByDay(dayArray);
          setFocusTimeByWeek(weekArray);
          setFocusTimeByMonth(monthArray);
          setFocusTimeByYear(yearArray);
        }).catch(console.error);
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);

  // Update the value of `n` based on the active component (e.g., day, week, month, year)
  useEffect(() => {
    let sessionData = [];
    
    switch (activeComponent) {
      case 'day':
        sessionData = state.daySession;
        break;
      case 'week':
        sessionData = state.weekSession;
        break;
      case 'month':
        sessionData = state.monthSession;
        break;
      case 'year':
        sessionData = state.yearSession;
        break;
      default:
        break;
    }
    console.log(`Active Component: ${activeComponent}, Session Data:`, sessionData);
    setN(sessionData ? sessionData.length : 0); // Update `n` based on session data
  }, [activeComponent, state]);

  // Render each square, with fish images depending on `n`
  const renderSquare = (row, col) => {
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
        {Array.from(Array(columns), (_, col) => renderSquare(row, col))}
      </div>
    );
  };

  // ViewComponent renders the chart based on active view
  const ViewComponent = ({ viewType }) => {
    let chartContent;
    switch (viewType) {
      case 'day':
        chartContent = state.daySession && n > 0 ? (
          <BarChartComponent dataArray={focusTimeByDay} />
        ) : (
          <p>Loading day chart data...</p>
        );
        break;
      case 'week':
        chartContent = state.weekSession && n > 0 ? (
          <BarChartComponent dataArray={focusTimeByWeek} />
        ) : (
          <p>Loading week chart data...</p>
        );
        break;
      case 'month':
        chartContent = state.monthSession && n > 0 ? (
          <BarChartComponent dataArray={focusTimeByMonth} />
        ) : (
          <p>Loading month chart data...</p>
        );
        break;
      case 'year':
        chartContent = state.yearSession && n > 0 ? (
          <BarChartComponent dataArray={focusTimeByYear} />
        ) : (
          <p>Loading year chart data...</p>
        );
        break;
      default:
        chartContent = <p>Select a valid view type.</p>;
    }

    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          {/* Display the appropriate chart content based on the viewType */}
          {chartContent}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Navbar */}
      <div style={{ flexShrink: 0 }}>
        <NavbarSide />
      </div>

      <div className="button-bar" style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <button onClick={() => setActiveComponent('day')}>Day View</button>
        <button onClick={() => setActiveComponent('week')}>Week View</button>
        <button onClick={() => setActiveComponent('month')}>Month View</button>
        <button onClick={() => setActiveComponent('year')}>Year View</button>
      </div>
  
      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Half: Array */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {state.daySession || state.weekSession || state.monthSession || state.yearSession
            ? Array.from(Array(rows), (_, row) => renderRow(row))
            : <p>Loading tank data...</p>}
        </div>
  
        {/* Bottom Half: Chart */}
        <div style={{ flex: 1 }}>
          <ViewComponent viewType={activeComponent} />
        </div>
      </div>
    </div>
  );  
};

export default Tanks;
