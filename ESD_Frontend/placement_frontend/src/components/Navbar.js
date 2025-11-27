import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('user');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.role) {
                    setUserRole(decoded.role);
                }
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Helper to check active route
    const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

    return (
        <nav className="app-navbar">
            <Link to="/dashboard" className="nav-brand">
                <span style={{
                    background: '#ffffffff',
                    color: 'black',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '1.2rem',
                    marginRight: '8px'
                }}>
                    NIAC
                </span>

                <span style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                    <span>National Institute of Advanced</span>
                    <span>Computing, Bangalore</span>
                </span>
            </Link>


            <div className="nav-menu">
                <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    Dashboard
                </Link>
                <Link to="/placement" className={`nav-item ${isActive('/placement') || isActive('/students') ? 'active' : ''}`}>
                    Placement History
                </Link>
                {userRole !== 'guest' && (
                    <Link to="/organisation-students" className={`nav-item ${isActive('/organisation-students') ? 'active' : ''}`}>
                        Organisation Students
                    </Link>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
