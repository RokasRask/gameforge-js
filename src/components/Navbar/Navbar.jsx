import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import Button from '../Button/Button';

const Navbar = () => {
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

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">Game<span className="navbar__logo-accent">Hub</span></span>
        </Link>

        <div className="navbar__menu-toggle" onClick={toggleMenu}>
          <div className={`navbar__menu-bar ${menuOpen ? 'open' : ''}`}></div>
        </div>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <ul className="navbar__list">
            <li className="navbar__item">
              <Link to="/" className="navbar__link" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="navbar__item">
              <Link to="/games" className="navbar__link" onClick={() => setMenuOpen(false)}>
                Games
              </Link>
            </li>
            <li className="navbar__item">
              <Link to="/contact" className="navbar__link" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
          
          <div className="navbar__buttons">
            <Button 
              type="secondary" 
              size="small"
              onClick={() => console.log('Submit game clicked')}
            >
              Submit Game
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;