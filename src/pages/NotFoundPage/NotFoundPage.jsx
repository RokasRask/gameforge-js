import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.scss';
import Button from '../../components/Button/Button';

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <div className="not-found__container">
        <div className="not-found__glitch">404</div>
        <h1 className="not-found__title">Page Not Found</h1>
        <p className="not-found__text">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <div className="not-found__actions">
          <Link to="/">
            <Button type="primary" size="large">
              Back to Home
            </Button>
          </Link>
          <Link to="/games">
            <Button type="secondary" size="large">
              Browse Games
            </Button>
          </Link>
        </div>
        
        <div className="not-found__decoration">
          <div className="not-found__gamepad">
            <i className="fas fa-gamepad"></i>
          </div>
          <div className="not-found__particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="not-found__particle"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;