import React from 'react';
import GameCard from '../../common/GameCard/GameCard';

/**
 * Component to display a grid of game cards
 * 
 * @param {Object} props - Component props
 * @param {Array} props.games - Array of game objects to display
 * @param {string} props.layout - Layout style ('grid' or 'list')
 * @param {string} props.className - Additional CSS class names
 */
const GamesList = ({
  games = [],
  layout = 'grid',
  className = ''
}) => {
  // If no games, show empty state
  if (games.length === 0) {
    return (
      <div className={`games-list games-list--empty ${className}`}>
        <div className="games-list__empty-state">
          <div className="games-list__empty-icon">🎮</div>
          <h3 className="games-list__empty-title">No Games Found</h3>
          <p className="games-list__empty-message">
            No games match your current filters or search criteria
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`games-list games-list--${layout} ${className}`}>
      <div className="games-list__container">
        {games.map((game) => (
          <div key={game.id} className="games-list__item">
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesList;