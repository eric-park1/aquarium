import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
// import Signup from "../screens/UserAuth/Signup";
// import Login from "../screens/UserAuth/Login";
import '../styles/App.css';

import Landing from "../pages/UserAuth/Landing";
import ThreeScene from "../pages/home/ThreeScene";


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<ThreeScene />} />
      </Routes>
    </>
  );
}

export default App;