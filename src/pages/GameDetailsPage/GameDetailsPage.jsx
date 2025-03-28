import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './GameDetailsPage.scss';
import Button from '../../components/Button/Button';

// Game data will be added later
const gamesData = [];

const GameDetailsPage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  
  // Fetch game data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundGame = gamesData.find(g => g.id === parseInt(gameId));
      setGame(foundGame);
      setLoading(false);
    }, 500);
  }, [gameId]);
  
  if (loading) {
    return (
      <div className="game-details-loading">
        <div className="game-details-loading__spinner"></div>
        <p>Loading game details...</p>
      </div>
    );
  }
  
  if (!game) {
    return (
      <div className="game-details-error">
        <h2>Game Not Found</h2>
        <p>Sorry, we couldn't find the game you're looking for.</p>
        <Link to="/games">
          <Button type="secondary">
            Back to Games
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="game-details">
      <div className="game-details-hero" style={{ backgroundImage: `url(${game.image})` }}>
        <div className="game-details-hero__overlay">
          <div className="container">
            <div className="game-details-hero__content">
              <div className="game-details-hero__category">{game.category}</div>
              <h1 className="game-details-hero__title">{game.title}</h1>
              <div className="game-details-hero__meta">
                <div className="game-details-hero__developer">
                  <span>Developer:</span> {game.developer}
                </div>
                <div className="game-details-hero__release">
                  <span>Released:</span> {game.releaseDate}
                </div>
                <div className="game-details-hero__rating">
                  <span>Rating:</span>
                  <div className="game-details-hero__stars">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`fa fa-star ${i < Math.floor(game.rating) ? 'filled' : ''}`}
                      ></i>
                    ))}
                    <span>{game.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              <div className="game-details-hero__buttons">
                <a 
                  href={game.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="game-details-hero__cta"
                >
                  <Button type="primary" size="large">
                    <i className="fas fa-external-link-alt"></i> Play Now
                  </Button>
                </a>
                <Button type="secondary">
                  <i className="fas fa-bookmark"></i> Save
                </Button>
                <Button type="secondary">
                  <i className="fas fa-share-alt"></i> Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="game-details-content">
          <div className="game-details-tabs">
            <button 
              className={`game-details-tabs__tab ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`game-details-tabs__tab ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              Features
            </button>
            <button 
              className={`game-details-tabs__tab ${activeTab === 'screenshots' ? 'active' : ''}`}
              onClick={() => setActiveTab('screenshots')}
            >
              Screenshots
            </button>
            <button 
              className={`game-details-tabs__tab ${activeTab === 'requirements' ? 'active' : ''}`}
              onClick={() => setActiveTab('requirements')}
            >
              System Requirements
            </button>
          </div>
          
          <div className="game-details-tabs-content">
            {activeTab === 'description' && (
              <div className="game-details-description">
                <p>{game.description}</p>
                <div className="game-details-description__price">
                  <h3>Price</h3>
                  <p>{game.price}</p>
                </div>
              </div>
            )}
            
            {activeTab === 'features' && (
              <div className="game-details-features">
                <ul className="game-details-features__list">
                  {game.features.map((feature, index) => (
                    <li key={index} className="game-details-features__item">
                      <i className="fas fa-check"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'screenshots' && (
              <div className="game-details-screenshots">
                <div className="game-details-screenshots__main">
                  <button 
                    className="game-details-screenshots__nav game-details-screenshots__nav--prev"
                    onClick={() => setActiveScreenshot((prev) => (prev > 0 ? prev - 1 : game.screenshots.length - 1))}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  <div className="game-details-screenshots__image-container">
                    <img 
                      src={game.screenshots[activeScreenshot]} 
                      alt={`${game.title} screenshot ${activeScreenshot + 1}`}
                      className="game-details-screenshots__image"
                    />
                  </div>
                  
                  <button 
                    className="game-details-screenshots__nav game-details-screenshots__nav--next"
                    onClick={() => setActiveScreenshot((prev) => (prev < game.screenshots.length - 1 ? prev + 1 : 0))}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
                
                <div className="game-details-screenshots__thumbnails">
                  {game.screenshots.map((screenshot, index) => (
                    <div 
                      key={index} 
                      className={`game-details-screenshots__thumbnail ${index === activeScreenshot ? 'active' : ''}`}
                      onClick={() => setActiveScreenshot(index)}
                    >
                      <img 
                        src={screenshot} 
                        alt={`${game.title} thumbnail ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'requirements' && (
              <div className="game-details-requirements">
                <h3>Minimum Requirements</h3>
                <div className="game-details-requirements__grid">
                  <div className="game-details-requirements__item">
                    <div className="game-details-requirements__label">OS</div>
                    <div className="game-details-requirements__value">{game.minimumRequirements.os}</div>
                  </div>
                  
                  <div className="game-details-requirements__item">
                    <div className="game-details-requirements__label">Processor</div>
                    <div className="game-details-requirements__value">{game.minimumRequirements.processor}</div>
                  </div>
                  
                  <div className="game-details-requirements__item">
                    <div className="game-details-requirements__label">Memory</div>
                    <div className="game-details-requirements__value">{game.minimumRequirements.memory}</div>
                  </div>
                  
                  <div className="game-details-requirements__item">
                    <div className="game-details-requirements__label">Graphics</div>
                    <div className="game-details-requirements__value">{game.minimumRequirements.graphics}</div>
                  </div>
                  
                  <div className="game-details-requirements__item">
                    <div className="game-details-requirements__label">Storage</div>
                    <div className="game-details-requirements__value">{game.minimumRequirements.storage}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="game-details-related">
          <h2 className="game-details-related__title">Similar Games</h2>
          {/* We'd render GameCard components here */}
          <p className="game-details-related__placeholder">No related games available at the moment.</p>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;