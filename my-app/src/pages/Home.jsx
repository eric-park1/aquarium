import React, { useState, useRef, useEffect } from "react";
import NavbarSide from "../components/SlidingPane";
import FishAnimation3 from "../FishAnimation3";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import "./Home.css";
import { useTimer } from "../hooks/useTimer";
import { enableRipple } from '@syncfusion/ej2-base';
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons';

// Fetch user data function
async function fetchUserData() {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const email = JSON.parse(storedUser).email;
    try {
      const response = await fetch(`/api/user/email/${email}`);
      if (!response.ok) {
        console.error(`Failed to fetch user data for ${email}`);
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  }
  return null;
}

const CountdownTimer = () => {
  const [timer, setTimer] = useState("00:00:00");
  const [duration, setDuration] = useState(null);
  const [marineType, setMarineType] = useState("FISH");
  const [isActive, setIsActive] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [timeFocused, setTimeFocused] = useState(0);
  const [sceneKey, setSceneKey] = useState(0);
  const { session } = useTimer();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserData();
      setUserData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Marine type change handler
  const handleMarineTypeChange = (event) => {
    setMarineType(event.target.value);
  };

  const Ref = useRef(null);

  // Reset animation when timer reaches 00:00:00
  useEffect(() => {
    if (timer === "00:00:00") {
      setPlayAnimation(false);
      setSceneKey((prevKey) => prevKey + 1); // Refresh scene
    }
  }, [timer]);

  // Calculate time remaining for the timer
  const getTimeRemaining = (endTime) => {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return { total, hours, minutes, seconds };
  };

  // Start timer with the calculated end time
  const startTimer = (endTime) => {
    const { total, hours, minutes, seconds } = getTimeRemaining(endTime);
    if (total > 0) {
      setTimer(
        `${hours > 9 ? hours : "0" + hours}:${
          minutes > 9 ? minutes : "0" + minutes
        }:${seconds > 9 ? seconds : "0" + seconds}`
      );
    } else {
      clearInterval(Ref.current);
      Ref.current = null;
      setPlayAnimation(false);
      setTimer("00:00:00");
      setIsActive(false);
      session(duration, marineType, true);
    }
  };

  // Clear previous timer and set a new interval
  const clearTimer = (endTime) => {
    if (Ref.current) {
      clearInterval(Ref.current);
      Ref.current = null;
    }
    const id = setInterval(() => startTimer(endTime), 1000);
    Ref.current = id;
  };

  // Get deadline time based on the duration
  const getDeadTime = () => {
    const deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + parseInt(duration, 10));
    return deadline;
  };

  // Start button handler
  const handleStart = () => {
    if (!duration || isNaN(duration) || duration <= 0 || !marineType) {
      console.log("Invalid Start:", { duration, marineType });
      return;
    }

    setIsActive(true);
    setTimeFocused(parseInt(duration, 10));
    setPlayAnimation(true);

    const deadline = getDeadTime();
    clearTimer(deadline);

    setShowPopup(false);
  };

  // Stop button handler
  const handleStop = () => {
    if (Ref.current) clearInterval(Ref.current);

    const [hours, minutes, seconds] = timer.split(":").map((unit) => parseInt(unit, 10));
    const remainingMinutes = hours * 60 + minutes + (seconds > 0 ? 1 : 0);

    const elapsedMinutes = Math.max(0, timeFocused - remainingMinutes);

    setPlayAnimation(false);
    setIsActive(false);
    setTimer("00:00:00");
    session(elapsedMinutes, marineType, false);
    setTimeFocused(0);
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="page-container">
      <div className="timer-container">
        <h2
          className="timer-button"
          onClick={() => !isActive && setShowPopup(true)}
        >
          {timer}
        </h2>
        <label>
          <div className='marine-type-btn'>
            <select
              id="marine-type"
              value={marineType}
              onChange={handleMarineTypeChange}
            >
              <option value="">Select Marine Type</option>
              {userData?.speciesOwned?.map((species, index) => (
                <option key={index} value={species}>
                  {species}
                </option>
              ))}
            </select>
          </div>
          {marineType && (
            <div>
              <h3>Selected Marine Type: {marineType}</h3>
            </div>
          )}
        </label>

        {isActive && (
          <button className="stop-btn" onClick={handleStop}>
            Cancel
          </button>
        )}
        {!isActive && !duration && (
          <button className="start-btn" onClick={() => setShowPopup(true)}>
            Fish!!
          </button>
        )}
        {!isActive && duration && marineType && (
          <button className="start-btn" onClick={handleStart}>
            Fish!!!
          </button>
        )}
      </div>

      {showPopup && (
        <div className="popup-container">
          <div className="popup">
            <div className="duration-buttons">
              {[1, 10, 15, 30, 60, 120, 180].map((min) => (
                <button
                  key={min}
                  className="duration-option"
                  onClick={() => {
                    setDuration(min);
                    setTimer(`${min}:00:00`);
                    setShowPopup(false);
                  }}
                >
                  {min} min
                </button>
              ))}
            </div>
            <div className="popup-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="canvas-container">
        <Canvas key={sceneKey}>
          <OrbitControls enabled={false} />
          <PerspectiveCamera
            makeDefault
            position={[-2, 10, -4]}
            fov={75}
            near={0.1}
            far={1000}
          />
          <ambientLight intensity={0.5} />
          <directionalLight intensity={1} />
          <FishAnimation3 animationPlay={playAnimation} />
        </Canvas>
      </div>
      <NavbarSide />
    </div>
  );
};

export default CountdownTimer;
