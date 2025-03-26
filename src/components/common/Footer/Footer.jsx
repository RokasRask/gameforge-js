import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component with 8-bit styling
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          {/* Logo and description */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              GameForge.js
            </Link>
            <p className="footer__description">
              The 8-bit gaming platform for JavaScript and React games
            </p>
          </div>

          {/* Navigation links */}
          <div className="footer__nav">
            <h3 className="footer__heading">Navigate</h3>
            <ul className="footer__links">
              <li><Link to="/" className="footer__link">Home</Link></li>
              <li><Link to="/games" className="footer__link">Games</Link></li>
              <li><Link to="/leaderboard" className="footer__link">Leaderboard</Link></li>
              <li><Link to="/contact" className="footer__link">Contact</Link></li>
            </ul>
          </div>

          {/* Developer section */}
          <div className="footer__developers">
            <h3 className="footer__heading">Developers</h3>
            <ul className="footer__links">
              <li><Link to="/developer-portal" className="footer__link">Developer Portal</Link></li>
              <li><Link to="/contact" className="footer__link">Submit a Game</Link></li>
              <li><a href="https://github.com/gameforgejs" className="footer__link" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>

          {/* Social links */}
          <div className="footer__social">
            <h3 className="footer__heading">Connect</h3>
            <div className="footer__social-icons">
              <a href="https://twitter.com" className="footer__social-icon footer__social-icon--twitter" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
              <a href="https://discord.com" className="footer__social-icon footer__social-icon--discord" aria-label="Discord" target="_blank" rel="noopener noreferrer">
                Discord
              </a>
              <a href="https://github.com" className="footer__social-icon footer__social-icon--github" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} GameForge.js. All rights reserved.
          </p>
          <div className="footer__legal">
            <Link to="/terms" className="footer__legal-link">Terms</Link>
            <Link to="/privacy" className="footer__legal-link">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;