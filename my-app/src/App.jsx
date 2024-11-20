import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import "./styles/App.css"


// pages & components
import Home from './pages/Home'
import Landing from './pages/Landing'
import Login from './pages/UserAuth/Login'
import Signup from './pages/UserAuth/Signup'
import ThreeScene from './pages/ThreeScene'

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
              element={user ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!user ? <Landing /> : <Navigate to="/" />} 
            />
            <Route 
              path="/about" 
              element={user ? <ThreeScene /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/leadership" 
              element={user ? <ThreeScene /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/tanks" 
              element={user ? <ThreeScene /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/shop" 
              element={user ? <ThreeScene /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/history" 
              element={user ? <ThreeScene /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/calendar" 
              element={user ? <ThreeScene /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/task" 
              element={user ? <ThreeScene /> : <Navigate to="/login" />} 
            />

            {/* <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;