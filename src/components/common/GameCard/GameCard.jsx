import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '../Rating/Rating';

/**
 * Game card component for displaying game information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.game - Game data object
 * @param {string} props.game.id - Game unique identifier
 * @param {string} props.game.title - Game title
 * @param {string} props.game.thumbnail - Game thumbnail image URL
 * @param {string} props.game.description - Short game description
 * @param {string} props.game.category - Game category
 * @param {number} props.game.rating - Game rating (0-5)
 * @param {number} props.game.plays - Number of times the game has been played
 * @param {Array} props.game.tags - Game tags
 */
const GameCard = ({ game }) => {
  const {
    id,
    title,
    thumbnail,
    description,
    category,
    rating = 0,
    plays = 0,
    tags = []
  } = game;

  return (
    <div className="game-card">
      {/* Card header with thumbnail */}
      <div className="game-card__header">
        <Link to={`/games/${id}`} className="game-card__thumbnail-link">
          <img
            src={thumbnail}
            alt={`${title} thumbnail`}
            className="game-card__thumbnail"
            loading="lazy"
          />
        </Link>
        <div className="game-card__category">{category}</div>
      </div>

      {/* Card content */}
      <div className="game-card__content">
        <Link to={`/games/${id}`} className="game-card__title-link">
          <h3 className="game-card__title">{title}</h3>
        </Link>
        
        <div className="game-card__meta">
          <div className="game-card__rating">
            <Rating value={rating} readonly size="small" />
            <span className="game-card__rating-value">{rating.toFixed(1)}</span>
          </div>
          <div className="game-card__plays">
            <span className="game-card__plays-icon"></span>
            <span className="game-card__plays-count">{plays.toLocaleString()}</span>
          </div>
        </div>
        
        <p className="game-card__description">{description}</p>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="game-card__tags">
            {tags.map((tag, index) => (
              <span key={index} className="game-card__tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card footer with action button */}
      <div className="game-card__footer">
        <Link to={`/games/${id}`} className="game-card__play-button">
          Play Now
        </Link>
      </div>
    </div>
  );
};

export default GameCard;