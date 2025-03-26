import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';

/**
 * 404 Not Found page component
 */
const NotFoundPage = () => {
  // State for pixel character position
  const [characterPos, setCharacterPos] = useState({ x: 50, y: 50 });
  // State for message visibility
  const [showMessage, setShowMessage] = useState(false);
  
  // Handle keyboard movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      const step = 10;
      let newPos = { ...characterPos };
      
      switch (e.key) {
        case 'ArrowUp':
          newPos.y = Math.max(0, characterPos.y - step);
          break;
        case 'ArrowDown':
          newPos.y = Math.min(90, characterPos.y + step);
          break;
        case 'ArrowLeft':
          newPos.x = Math.max(0, characterPos.x - step);
          break;
        case 'ArrowRight':
          newPos.x = Math.min(90, characterPos.x + step);
          break;
        default:
          return;
      }
      
      setCharacterPos(newPos);
      
      // Show hidden message if character reaches certain position
      if (newPos.x > 80 && newPos.y > 80) {
        setShowMessage(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [characterPos]);
  
  // Random error messages
  const errorMessages = [
    "Game Over! This page doesn't exist.",
    "Error 404: You took a wrong turn in the dungeon!",
    "The princess is in another castle!",
    "Page not found. Would you like to continue? [Yes/No]",
    "This level is still under construction!"
  ];
  
  // Pick a random message
  const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
  
  return (
    <div className="not-found-page">
      <div className="not-found-page__container">
        <div className="not-found-page__error">
          <div className="not-found-page__error-code">404</div>
          <div className="not-found-page__error-message">{randomMessage}</div>
        </div>
        
        <div className="not-found-page__game">
          <div className="not-found-page__game-message">
            Use arrow keys to move the character!
          </div>
          
          <div className="not-found-page__game-area">
            {/* Hidden chests in corners */}
            <div className="not-found-page__game-chest not-found-page__game-chest--top-left"></div>
            <div className="not-found-page__game-chest not-found-page__game-chest--top-right"></div>
            <div className="not-found-page__game-chest not-found-page__game-chest--bottom-left"></div>
            <div className="not-found-page__game-chest not-found-page__game-chest--bottom-right"></div>
            
            {/* Character */}
            <div 
              className="not-found-page__game-character"
              style={{ 
                left: `${characterPos.x}%`, 
                top: `${characterPos.y}%` 
              }}
            ></div>
          </div>
          
          {/* Hidden message shows when reaching bottom-right chest */}
          {showMessage && (
            <div className="not-found-page__secret-message">
              You found a secret! 🎮
            </div>
          )}
          
          <div className="not-found-page__controls">
            <div className="not-found-page__controls-button not-found-page__controls-button--up">↑</div>
            <div className="not-found-page__controls-button not-found-page__controls-button--left">←</div>
            <div className="not-found-page__controls-button not-found-page__controls-button--down">↓</div>
            <div className="not-found-page__controls-button not-found-page__controls-button--right">→</div>
          </div>
        </div>
        
        <div className="not-found-page__action">
          <Link to="/">
            <Button variant="primary" size="large">Go Home!</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;