import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.scss';

const GameCard = ({ 
  id, 
  title, 
  developer,
  image, 
  category, 
  rating,
  releaseDate,
  isFeatured = false
}) => {
  return (
    <div className={`game-card ${isFeatured ? 'game-card--featured' : ''}`}>
      <div className="game-card__image-container">
        <img src={image} alt={title} className="game-card__image" />
        <div className="game-card__overlay">
          <span className="game-card__category">{category}</span>
          {rating && (
            <div className="game-card__rating">
              <span className="game-card__rating-value">{rating}</span>
              <div className="game-card__rating-stars">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i} 
                    className={`fa fa-star ${i < Math.floor(rating) ? 'filled' : ''}`}
                  ></i>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="game-card__content">
        <h3 className="game-card__title">{title}</h3>
        <p className="game-card__developer">by {developer}</p>
        
        <div className="game-card__info">
          <div className="game-card__release">
            <i className="fas fa-calendar-alt"></i>
            <span>{releaseDate}</span>
          </div>
        </div>
        
        <Link to={`/games/${id}`} className="game-card__link">
          View Details
          <i className="fas fa-chevron-right"></i>
        </Link>
      </div>
      
      {isFeatured && <div className="game-card__featured-badge">Featured</div>}
    </div>
  );
};

export default GameCard;