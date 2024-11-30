//import React, { useState, useRef, useEffect } from "react";
import NavbarSide from "../components/SlidingPane";

import React from 'react';

async function getUserByEmail(email) {
    const response = await fetch(`/user?email=${encodeURIComponent(email)}`);
    const data = await response.json();

    if (response.ok) {
        console.log('User data:', data);
    } else {
        console.error('Error fetching user:', data.error);
    }
    return data;
};

const Tanks = () => {
  const rows = 8; 
  const columns = 8;

  let email = null; // Extract userId from localStorage
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
      try {
      const parsedUser = JSON.parse(storedUser);
      email = parsedUser.email // Adjust based on your schema
     } catch (error) {
      console.error("Error parsing user data from localStorage", error);
    }
  }
//   const data = getUserByEmail(email); // data will be user schema data
//   if (data) {
//     const user = await User.findById(userId).populate('achievements');
//   }

//   if (data && data.aquarium.length > 0) {
//       data.aquarium.forEach()
//   }

  const renderSquare = (row, col) => {
    const isBlack = (row + col) % 2 === 1;
    const squareStyle = { 
      backgroundColor: isBlack ? 'black' : 'white',
      width: '50px',
      height: '50px'
    };

    return <div key={`${row}-${col}`} style={squareStyle}></div>;
  };

  const renderRow = (row) => {
    return (
      <div key={row} style={{ display: 'flex' }}>
        {Array.from(Array(columns), (_, col) => renderSquare(row, col))}
      </div>
    );
  };

  return (
    <div>
        <div>
            {Array.from(Array(rows), (_, row) => renderRow(row))}
        </div>
        <div>
            <NavbarSide />
        </div>
    </div>
  );
};

export default Tanks;