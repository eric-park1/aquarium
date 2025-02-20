import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import "./styles/App.css";

import React from "react";
// pages & components

import TanksFishies from "./pages/History";
import CountdownTimer from "./pages/Home";
import Landing from "./pages/Landing";
import Tanks from "./pages/Tanks";
import Shop from "./pages/shop";



function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">

      <BrowserRouter>
        <div className="pages">
        {/* <Navbar /> */}
          <Routes>
            <Route 
              path="/" 
              element={user ? <CountdownTimer /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!user ? <Landing /> : <Navigate to="/" />} 
            />
            <Route 
              path="/about" 
              element={user ? <TanksFishies /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/tanks" 
              element={user ? <Tanks /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/shop" 
              element={user ? <Shop /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;