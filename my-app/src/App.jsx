import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import "./styles/App.css"


// pages & components
import Land from './pages/ThreeScene'
import Landing from './pages/Landing'
import Login from './pages/UserAuth/Login'
import Signup from './pages/UserAuth/Signup'
import Navbar from './components/Navbasr'

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
        <Navbar />
          <Routes>
            <Route 
              path="/" 
              element={user ? <Land /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!user ? <Landing /> : <Navigate to="/" />} 
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