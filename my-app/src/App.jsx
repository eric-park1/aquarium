import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;