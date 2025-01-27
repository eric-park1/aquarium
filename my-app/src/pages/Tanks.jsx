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
  const [state, setState] = useState({});
  const [focusData, setFocusData] = useState({});
  const [activeView, setActiveView] = useState("day");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.email) {
      getAllSessions(storedUser.email)
        .then((data) => {
          setState(data);
          const { dayArray, weekArray, monthArray, yearArray } = sessionRecord(
            data.daySession,
            data.weekSession,
            data.monthSession,
            data.yearSession
          );
          setFocusData({ dayArray, weekArray, monthArray, yearArray });
        })
        .catch(console.error);
    }
  }, []);

  const renderChart = () => {
    const labels = {
      day: Array.from({ length: 24 }, (_, i) => `${i}:00`), // Hourly labels
      week: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // Weekly labels
      month: focusData.monthArray?.map((_, i) => `Day ${i + 1}`), // Daily labels for the month
      year: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ], // Monthly labels
    }[activeView] || [];
  
    const chartData =
      {
        day: focusData.dayArray,
        week: focusData.weekArray,
        month: focusData.monthArray,
        year: focusData.yearArray,
      }[activeView] || [];
  
    return <BarChartComponent dataArray={chartData} labels={labels} />;
  };

  return (
    <div className="tanks-container">
      <NavbarSide />
      <div className="button-bar">
        {["day", "week", "month", "year"].map((view) => (
          <button
            key={view}
            className={`view-button ${activeView === view ? "active" : ""}`}
            onClick={() => setActiveView(view)}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)} View
          </button>
        ))}
      </div>
      <div className="chart-container">{renderChart()}</div>
    </div>
  );
};

export default Tanks;