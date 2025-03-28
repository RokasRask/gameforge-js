import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.scss';

const GameCard = ({ 
  id, 
  title, 
  creator,
  thumbnailUrl, 
  category, 
  description,
  dateAdded,
  isFeatured = false
}) => {
  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  };

  // Truncate description for display
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className={`game-card ${isFeatured ? 'game-card--featured' : ''}`}>
      <div className="game-card__image-container">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="game-card__image" />
        ) : (
          <div className="game-card__image-placeholder">
            <i className="fas fa-gamepad"></i>
          </div>
        )}
        <div className="game-card__overlay">
          <span className="game-card__category">{category}</span>
          {isFeatured && (
            <div className="game-card__badge">
              <i className="fas fa-star"></i>
              <span>Featured</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="game-card__content">
        <h3 className="game-card__title">{title}</h3>
        <p className="game-card__creator">by {creator}</p>
        
        <p className="game-card__description">
          {truncateDescription(description)}
        </p>
        
        <div className="game-card__info">
          <div className="game-card__date">
            <i className="fas fa-calendar-alt"></i>
            <span>{dateAdded ? formatDate(dateAdded) : 'Unknown date'}</span>
          </div>
        </div>
        
        <Link to={`/games/${id}`} className="game-card__link">
          <span>Play Now!</span>
          <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
      
      {isFeatured && <div className="game-card__featured-badge">Featured</div>}
    </div>
  );
};

export default GameCard;