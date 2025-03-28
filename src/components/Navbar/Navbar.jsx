import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import Button from '../Button/Button';
import AuthContext from '../../contexts/Auth';
import axios from 'axios';
import { serverUrl } from '../../Constants/main';
import { useMessage } from '../../contexts/MessageContext';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const { addMessage } = useMessage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Function to check if the link is active
  const isLinkActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    
    if (path === '/games' && (location.pathname === '/games' || location.pathname.startsWith('/games/'))) {
      return true;
    }
    
    if (path !== '/' && path !== '/games' && location.pathname === path) {
      return true;
    }
    
    return false;
  };

  // Open logout confirmation modal
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  // Close logout confirmation modal
  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Confirm logout and proceed
  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    
    try {
      // Make logout request
      await axios.post(serverUrl + 'logout', {}, { withCredentials: true });
      
      // Clear user data in context
      setUser(null);
      
      // Show success message
      addMessage('You have been logged out successfully', 'success');
      
      // Close mobile menu if open
      setMenuOpen(false);
      
      // Close modal
      setShowLogoutModal(false);
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      addMessage('Error during logout', 'error');
      setShowLogoutModal(false);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        {/* Logo (Left) */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">Game<span className="navbar__logo-accent">Forge.js</span></span>
        </Link>

        {/* Navigation Links (Center) */}
        <ul className="navbar__navigation">
          <li className="navbar__item">
            <Link 
              to="/" 
              className={`navbar__link ${isLinkActive('/') ? 'navbar__link--active' : ''}`} 
            >
              Home
            </Link>
          </li>
          <li className="navbar__item">
            <Link 
              to="/games" 
              className={`navbar__link ${isLinkActive('/games') ? 'navbar__link--active' : ''}`} 
            >
              Games
            </Link>
          </li>
          <li className="navbar__item">
            <Link 
              to="/contact" 
              className={`navbar__link ${isLinkActive('/contact') ? 'navbar__link--active' : ''}`} 
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Menu Toggle (Mobile) */}
        <div className="navbar__menu-toggle" onClick={toggleMenu}>
          <div className={`navbar__menu-bar ${menuOpen ? 'open' : ''}`}></div>
        </div>

        {/* Auth Buttons (Right) */}
        <div className={`navbar__auth ${menuOpen ? 'navbar__auth--open' : ''}`}>
          {user ? (
            <div className="navbar__user">
              <span className="navbar__username">{user.name}</span>
              <Button 
                type="secondary" 
                size="small"
                onClick={handleLogoutClick}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="navbar__auth-buttons">
              <Link to="/login">
                <Button type="secondary" size="small">Login</Button>
              </Link>
              <Link to="/register">
                <Button type="primary" size="small">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <ul className="navbar__mobile-list">
          <li className="navbar__mobile-item">
            <Link 
              to="/" 
              className={`navbar__mobile-link ${isLinkActive('/') ? 'navbar__mobile-link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="navbar__mobile-item">
            <Link 
              to="/games" 
              className={`navbar__mobile-link ${isLinkActive('/games') ? 'navbar__mobile-link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Games
            </Link>
          </li>
          <li className="navbar__mobile-item">
            <Link 
              to="/contact" 
              className={`navbar__mobile-link ${isLinkActive('/contact') ? 'navbar__mobile-link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        confirmText="Yes, Log Out"
        cancelText="Cancel"
        isLoading={loggingOut}
      />
    </nav>
  );
};

export default Navbar;