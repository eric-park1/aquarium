import React, { useState } from "react";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate, Link } from "react-router-dom";

import bar_icon from "../assets/menu-bar.png";

const NavbarSide = () => {
    const [isPaneOpen, setIsPaneOpen] = useState(false);
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout()
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsPaneOpen(false); // Close the pane after navigating
    };

    return (
        <div>
            <img
                src={bar_icon}
                alt="Open Menu"
                style={menuIconStyle}
                onClick={() => setIsPaneOpen(true)}
            />
           
            <SlidingPane
                isOpen={isPaneOpen}
                title="My Sliding Pane"
                width="350px"
                onRequestClose={() => setIsPaneOpen(false)}
            >
                <div>
                    <nav>
                        {user && (
                            <div>
                                {/* <span>{user.email}</span> */}
                                <button style={buttonStyle} onClick={handleLogout}>Log out</button>
                                <button style={buttonStyle} onClick={() => handleNavigation('/about')}>About</button>
                                <button style={buttonStyle} onClick={() => handleNavigation('/leadership')}>Leadership</button>
                                <button style={buttonStyle} onClick={() => handleNavigation('/tanks')}>Your Tanks</button>
                                <button style={buttonStyle} onClick={() => handleNavigation('/shop')}>Shop</button>
                                <button style={buttonStyle} onClick={() => handleNavigation('/history')}>History</button>
                                <button style={buttonStyle} onClick={() => handleNavigation('/calendar')}>Calendar</button>
                                <button style={buttonStyle} onClick={() => handleNavigation('/task')}>Task</button>
                            </div>
                        )}
                        {!user && (
                            <div>
                                <Link to="/login">Login</Link>
                                <Link to="/signup">Signup</Link>
                            </div>
                        )}
                    </nav>
                </div>
            </SlidingPane>
        </div>
    );
    
}

const menuIconStyle = {
    position: "absolute", // Allows placement relative to the container
    top: "10px", // Adjust top position as needed
    right: "10px", // Adjust right position to place in the corner
    width: "30px", // Adjust icon size
    height: "30px",
    color: "#fff",
    backgroundColor: "#fff",
    cursor: "pointer",
};

const buttonStyle = {
    display: 'block', // Each button takes up the full width
    width: '100%',
    margin: '8px 0', // Adds space between buttons
    padding: '10px',
    backgroundColor: '#1F1746',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    textAlign: 'center',
    cursor: 'pointer',
};

export default NavbarSide;