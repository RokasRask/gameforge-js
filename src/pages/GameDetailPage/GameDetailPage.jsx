import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import GameFrame from '../../components/games/GameFrame/GameFrame';
import ReviewSection from '../../components/games/ReviewSection/ReviewSection';
import Rating from '../../components/common/Rating/Rating';
import Leaderboard from '../../components/common/Leaderboard/Leaderboard';

/**
 * Game detail page component
 */
const GameDetailPage = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  // Fetch game data based on ID
  useEffect(() => {
    const fetchGameDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call - this would be a real API call in production
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock game data
        const mockGame = {
          id,
          title: 'Pixel Platformer',
          developer: 'RetroDevs',
          description: 'Jump and run through challenging levels in this retro platformer. Collect coins, avoid enemies, and reach the end of each level to progress.',
          longDescription: `
            Pixel Platformer is an 8-bit style platformer game that combines classic gameplay with modern mechanics.
            
            The game features:
            - 20 challenging levels
            - Various enemies with unique behaviors
            - Power-ups and special abilities
            - Retro pixel art and chiptune music
            - Collectibles and secrets to discover
            
            The controls are simple: use arrow keys to move, space to jump, and Z to attack. Can you beat all the levels and become the Pixel Master?
          `,
          thumbnail: '/assets/images/games/pixel-platformer.png',
          screenshots: [
            '/assets/images/games/pixel-platformer-1.png',
            '/assets/images/games/pixel-platformer-2.png',
            '/assets/images/games/pixel-platformer-3.png',
          ],
          category: 'platformer',
          tags: ['platformer', 'action', 'retro', 'pixel-art'],
          rating: 4.5,
          ratingCount: 28,
          plays: 1250,
          createdAt: '2023-09-15T12:00:00Z',
          updatedAt: '2023-10-20T14:30:00Z',
          controls: {
            'Arrow Keys': 'Move',
            'Space': 'Jump',
            'Z': 'Attack',
            'X': 'Special ability',
            'P': 'Pause game'
          },
          reviews: [
            {
              id: 'rev1',
              user: 'GameFan42',
              avatar: '/assets/images/avatars/user1.png',
              rating: 5,
              comment: 'Amazing game! Love the pixel art and challenging levels.',
              date: '2023-10-18T09:12:00Z'
            },
            {
              id: 'rev2',
              user: 'RetroLover',
              avatar: '/assets/images/avatars/user2.png',
              rating: 4,
              comment: 'Great platformer with good controls. Some levels are too difficult though.',
              date: '2023-10-05T16:45:00Z'
            }
          ],
          leaderboard: [
            { rank: 1, user: 'PixelMaster', score: 9850, date: '2023-10-15' },
            { rank: 2, user: 'RetroChamp', score: 9200, date: '2023-10-10' },
            { rank: 3, user: 'GameWizard', score: 8750, date: '2023-10-12' },
            { rank: 4, user: 'PlatformKing', score: 8500, date: '2023-09-25' },
            { rank: 5, user: 'JumpQueen', score: 7900, date: '2023-10-05' }
          ]
        };
        
        setGame(mockGame);
      } catch (err) {
        console.error('Error fetching game details:', err);
        setError('Failed to load game details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGameDetails();
  }, [id]);
  
  // Handle play button click
  const handlePlay = () => {
    setIsPlaying(true);
    // Could also increment play count via API here
  };
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  if (isLoading) {
    return (
      <div className="game-detail-page game-detail-page--loading">
        <div className="pixel-loader"></div>
        <p>Loading game...</p>
      </div>
    );
  }
  
  if (error || !game) {
    return (
      <div className="game-detail-page game-detail-page--error">
        <div className="error-message">
          <h2>Oops!</h2>
          <p>{error || 'Game not found.'}</p>
          <Link to="/games">
            <Button variant="primary">Back to Games</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="game-detail-page">
      <div className="game-detail-page__container">
        {/* Game header section */}
        <div className="game-detail-page__header">
          <div className="game-detail-page__thumbnail">
            <img 
              src={game.thumbnail} 
              alt={`${game.title} thumbnail`} 
              className="game-detail-page__thumbnail-img"
            />
          </div>
          
          <div className="game-detail-page__info">
            <h1 className="game-detail-page__title">{game.title}</h1>
            
            <div className="game-detail-page__meta">
              <div className="game-detail-page__developer">
                by <span>{game.developer}</span>
              </div>
              
              <div className="game-detail-page__rating">
                <Rating value={game.rating} readonly />
                <span className="game-detail-page__rating-value">
                  {game.rating.toFixed(1)} ({game.ratingCount} ratings)
                </span>
              </div>
              
              <div className="game-detail-page__category">
                <span className="game-detail-page__category-label">Category: </span>
                <Link 
                  to={`/categories/${game.category}`}
                  className="game-detail-page__category-link"
                >
                  {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
                </Link>
              </div>
              
              <div className="game-detail-page__plays">
                <span className="game-detail-page__plays-icon"></span>
                <span className="game-detail-page__plays-count">
                  {game.plays.toLocaleString()} plays
                </span>
              </div>
            </div>
            
            <div className="game-detail-page__description">
              {game.description}
            </div>
            
            <div className="game-detail-page__tags">
              {game.tags.map((tag, index) => (
                <span key={index} className="game-detail-page__tag">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="game-detail-page__actions">
              <Button 
                variant="primary" 
                size="large" 
                onClick={handlePlay}
                className="game-detail-page__play-button"
              >
                Play Now
              </Button>
            </div>
          </div>
        </div>
        
        {/* Game content section */}
        {isPlaying && (
          <div className="game-detail-page__game-container">
            <GameFrame 
              gameId={game.id} 
              title={game.title}
              onClose={() => setIsPlaying(false)}
            />
          </div>
        )}
        
        {/* Tabs section */}
        <div className="game-detail-page__tabs">
          <div className="game-detail-page__tab-buttons">
            <button
              className={`game-detail-page__tab-button ${activeTab === 'description' ? 'is-active' : ''}`}
              onClick={() => handleTabChange('description')}
            >
              Description
            </button>
            <button
              className={`game-detail-page__tab-button ${activeTab === 'controls' ? 'is-active' : ''}`}
              onClick={() => handleTabChange('controls')}
            >
              Controls
            </button>
            <button
              className={`game-detail-page__tab-button ${activeTab === 'screenshots' ? 'is-active' : ''}`}
              onClick={() => handleTabChange('screenshots')}
            >
              Screenshots
            </button>
            <button
              className={`game-detail-page__tab-button ${activeTab === 'leaderboard' ? 'is-active' : ''}`}
              onClick={() => handleTabChange('leaderboard')}
            >
              Leaderboard
            </button>
          </div>
          
          <div className="game-detail-page__tab-content">
            {/* Description tab */}
            {activeTab === 'description' && (
              <div className="game-detail-page__tab-pane">
                <div className="game-detail-page__long-description">
                  {game.longDescription.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
            {/* Controls tab */}
            {activeTab === 'controls' && (
              <div className="game-detail-page__tab-pane">
                <div className="game-detail-page__controls">
                  <h3 className="game-detail-page__controls-title">Game Controls</h3>
                  <div className="game-detail-page__controls-grid">
                    {Object.entries(game.controls).map(([key, action], index) => (
                      <div key={index} className="game-detail-page__control-item">
                        <span className="game-detail-page__control-key">{key}</span>
                        <span className="game-detail-page__control-action">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Screenshots tab */}
            {activeTab === 'screenshots' && (
              <div className="game-detail-page__tab-pane">
                <div className="game-detail-page__screenshots">
                  {game.screenshots.map((screenshot, index) => (
                    <div key={index} className="game-detail-page__screenshot">
                      <img
                        src={screenshot}
                        alt={`${game.title} screenshot ${index + 1}`}
                        className="game-detail-page__screenshot-img"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Leaderboard tab */}
            {activeTab === 'leaderboard' && (
              <div className="game-detail-page__tab-pane">
                <Leaderboard 
                  entries={game.leaderboard} 
                  title="High Scores"
                  className="game-detail-page__leaderboard"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Reviews section */}
        <ReviewSection
          gameId={game.id}
          reviews={game.reviews}
          className="game-detail-page__reviews"
        />
        
        {/* Related games section */}
        <div className="game-detail-page__related">
          <h2 className="game-detail-page__related-title">You Might Also Like</h2>
          <div className="game-detail-page__related-games">
            {/* This would be populated with related games based on category/tags */}
            <p className="game-detail-page__related-placeholder">
              Related games will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;