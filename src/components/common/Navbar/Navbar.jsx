import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Main navigation bar with 8-bit styling
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // TODO: Add 8-bit sound effect on toggle
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">GameForge.js</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className={`navbar__mobile-toggle ${isMenuOpen ? 'is-active' : ''}`}
          aria-label="Toggle menu"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation links */}
        <div className={`navbar__menu ${isMenuOpen ? 'is-open' : ''}`}>
          <div className="navbar__links">
            <Link to="/" className="navbar__link">Home</Link>
            <Link to="/games" className="navbar__link">Games</Link>
            <Link to="/leaderboard" className="navbar__link">Leaderboard</Link>
            <Link to="/contact" className="navbar__link">Contact</Link>
          </div>

          {/* Authentication buttons */}
          <div className="navbar__auth">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="navbar__link navbar__link--profile">Profile</Link>
                <button 
                  className="navbar__link navbar__link--logout" 
                  onClick={() => setIsLoggedIn(false)}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar__link navbar__link--login">Login</Link>
                <Link to="/register" className="navbar__link navbar__link--register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;