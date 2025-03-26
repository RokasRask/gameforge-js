import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';

/**
 * Featured games carousel/slider component
 * 
 * @param {Object} props - Component props
 * @param {Array} props.games - Array of game objects to display
 * @param {string} props.className - Additional CSS class names
 */
const FeaturedCarousel = ({ games = [], className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    if (games.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % games.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [games.length]);
  
  // Handle manual navigation
  const goToSlide = (index) => {
    setActiveIndex(index);
  };
  
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % games.length);
  };
  
  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length);
  };
  
  // If no games, show placeholder
  if (games.length === 0) {
    return (
      <div className={`featured-carousel ${className}`}>
        <div className="featured-carousel__placeholder">
          <p>No featured games available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`featured-carousel ${className}`}>
      <div className="featured-carousel__container">
        {/* Slides */}
        <div className="featured-carousel__slides">
          {games.map((game, index) => (
            <div 
              key={game.id} 
              className={`featured-carousel__slide ${index === activeIndex ? 'is-active' : ''}`}
              aria-hidden={index !== activeIndex}
            >
              <div className="featured-carousel__slide-inner">
                <div className="featured-carousel__slide-media">
                  <img 
                    src={game.thumbnail} 
                    alt={`${game.title} screenshot`} 
                    className="featured-carousel__slide-image"
                  />
                </div>
                <div className="featured-carousel__slide-content">
                  <div className="featured-carousel__game-category">{game.category}</div>
                  <h3 className="featured-carousel__game-title">{game.title}</h3>
                  <p className="featured-carousel__game-description">{game.description}</p>
                  <div className="featured-carousel__game-action">
                    <Link to={`/games/${game.id}`}>
                      <Button variant="primary">Play Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation controls */}
        {games.length > 1 && (
          <>
            <button
              className="featured-carousel__nav featured-carousel__nav--prev"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              ◄
            </button>
            <button
              className="featured-carousel__nav featured-carousel__nav--next"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              ►
            </button>
            
            {/* Pagination indicators */}
            <div className="featured-carousel__pagination">
              {games.map((_, index) => (
                <button
                  key={index}
                  className={`featured-carousel__dot ${index === activeIndex ? 'is-active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedCarousel;