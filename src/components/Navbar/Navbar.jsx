import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import Button from '../Button/Button';
import AuthContext from '../../contexts/Auth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">Game<span className="navbar__logo-accent">Forge.js</span></span>
        </Link>

        <div className="navbar__menu-toggle" onClick={toggleMenu}>
          <div className={`navbar__menu-bar ${menuOpen ? 'open' : ''}`}></div>
        </div>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <ul className="navbar__list">
            <li className="navbar__item">
              <Link 
                to="/" 
                className={`navbar__link ${isLinkActive('/') ? 'navbar__link--active' : ''}`} 
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="navbar__item">
              <Link 
                to="/games" 
                className={`navbar__link ${isLinkActive('/games') ? 'navbar__link--active' : ''}`} 
                onClick={() => setMenuOpen(false)}
              >
                Games
              </Link>
            </li>
            <li className="navbar__item">
              <Link 
                to="/contact" 
                className={`navbar__link ${isLinkActive('/contact') ? 'navbar__link--active' : ''}`} 
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
          
          <div className="navbar__buttons">
            {user ? (
              <div className="navbar__user">
                <span className="navbar__username">Hello, {user.name}</span>
                <Button 
                  type="secondary" 
                  size="small"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button type="secondary" size="small">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <Button type="primary" size="small">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;