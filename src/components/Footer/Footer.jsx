import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';
import AuthContext from '../../contexts/Auth';

const Footer = () => {
  const { isAdmin } = useContext(AuthContext);

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <h2 className="footer__logo">Game<span>Forge.js</span></h2>
          <p className="footer__tagline">
            Your gateway to JavaScript-based game discovery
          </p>
          <div className="footer__social">
            <a href="#" className="footer__social-link" aria-label="Discord">
              <i className="fab fa-discord"></i>
            </a>
            <a href="#" className="footer__social-link" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="footer__social-link" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="footer__social-link" aria-label="Twitch">
              <i className="fab fa-twitch"></i>
            </a>
          </div>
        </div>
        
        <div className="footer__nav">
          <h3 className="footer__heading">Navigation</h3>
          <ul className="footer__links">
            <li><Link to="/" className="footer__link">Home</Link></li>
            <li><Link to="/games" className="footer__link">Games</Link></li>
            <li><Link to="/contact" className="footer__link">Contact</Link></li>
            {isAdmin && (
              <li><Link to="/admin" className="footer__link">Admin Dashboard</Link></li>
            )}
          </ul>
        </div>
        
        <div className="footer__categories">
          <h3 className="footer__heading">Categories</h3>
          <ul className="footer__links">
            <li><Link to="/games/category/canvas" className="footer__link">Canvas</Link></li>
            <li><Link to="/games/category/webgl" className="footer__link">WebGL</Link></li>
            <li><Link to="/games/category/react" className="footer__link">React</Link></li>
            <li><Link to="/games/category/phaser" className="footer__link">Phaser</Link></li>
            <li><Link to="/games/category/p5.js" className="footer__link">p5.js</Link></li>
            <li><Link to="/games/category/three.js" className="footer__link">Three.js</Link></li>
          </ul>
        </div>
        
        <div className="footer__newsletter">
          <h3 className="footer__heading">Join Our Newsletter</h3>
          <p className="footer__newsletter-text">
            Stay updated with the latest games and features
          </p>
          <form className="footer__form">
            <input 
              type="email" 
              placeholder="Your email" 
              className="footer__input"
              aria-label="Email for newsletter" 
            />
            <button type="submit" className="footer__submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="footer__bottom">
        <p className="footer__copyright">
          &copy; {new Date().getFullYear()} GameForge.js. All rights reserved.
        </p>
        <div className="footer__legal">
          <Link to="/privacy" className="footer__legal-link">Privacy Policy</Link>
          <Link to="/terms" className="footer__legal-link">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;