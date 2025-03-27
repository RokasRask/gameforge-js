import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gameRegistry from '../../utils/gameRegistry';

/**
 * GameManager - Admin component for managing games
 */
const GameManager = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Load games and categories on mount
  useEffect(() => {
    const loadGamesAndCategories = async () => {
      try {
        setIsLoading(true);
        
        // Get all games
        const allGames = gameRegistry.getAllGames();
        setGames(allGames);
        
        // Get all categories
        const allCategories = gameRegistry.getAllCategories();
        setCategories([
          { id: 'all', name: 'All Categories' },
          ...allCategories
        ]);
        
        // Get category from URL query params if any
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
          setSelectedCategory(categoryParam);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading games:', error);
        setIsLoading(false);
      }
    };
    
    loadGamesAndCategories();
  }, [location.search]);
  
  // Apply filters when search query, category, or sort option changes
  useEffect(() => {
    if (games.length === 0) return;
    
    // Apply filtering
    let result = [...games];
    
    // Filter by search query
    if (searchQuery) {
      result = gameRegistry.searchGames(searchQuery);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(game => game.category === selectedCategory);
    }
    
    // Apply sorting
    result = gameRegistry.sortGames(result, sortBy);
    
    setFilteredGames(result);
    
    // Update URL with current filters
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    if (sortBy !== 'newest') {
      params.set('sort', sortBy);
    }
    
    const newUrl = `${location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(newUrl, { replace: true });
    
  }, [games, searchQuery, selectedCategory, sortBy, location.pathname, navigate]);
  
  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle category selection
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  // Handle sort selection
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Handle item selection
  const handleSelectGame = (gameId) => {
    if (selectedGames.includes(gameId)) {
      setSelectedGames(selectedGames.filter(id => id !== gameId));
    } else {
      setSelectedGames([...selectedGames, gameId]);
    }
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedGames.length === filteredGames.length) {
      setSelectedGames([]);
    } else {
      setSelectedGames(filteredGames.map(game => game.id));
    }
  };
  
  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (selectedGames.length === 0) return;
    
    switch (action) {
      case 'delete':
        // In a real implementation, this would delete the selected games
        alert(`Would delete ${selectedGames.length} games`);
        // After successful deletion, reset selection
        setSelectedGames([]);
        break;
        
      case 'feature':
        // In a real implementation, this would feature the selected games
        alert(`Would feature ${selectedGames.length} games`);
        break;
        
      case 'unfeature':
        // In a real implementation, this would unfeature the selected games
        alert(`Would unfeature ${selectedGames.length} games`);
        break;
        
      default:
        break;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="game-manager">
      <div className="game-manager__header">
        <h1 className="game-manager__title">Manage Games</h1>
        <Link to="/admin/games/add" className="game-manager__add-button">
          Add New Game
        </Link>
      </div>
      
      {/* Filters */}
      <div className="game-manager__filters">
        <div className="game-manager__search">
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={handleSearch}
            className="game-manager__search-input"
          />
        </div>
        
        <div className="game-manager__filter-group">
          <select 
            value={selectedCategory} 
            onChange={handleCategoryChange}
            className="game-manager__select"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <select 
            value={sortBy} 
            onChange={handleSortChange}
            className="game-manager__select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">A-Z</option>
            <option value="plays">Most Played</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>
      
      {/* Bulk actions */}
      {selectedGames.length > 0 && (
        <div className="game-manager__bulk-actions">
          <span className="game-manager__selected-count">
            {selectedGames.length} {selectedGames.length === 1 ? 'game' : 'games'} selected
          </span>
          
          <div className="game-manager__actions">
            <button 
              className="game-manager__action-button game-manager__action-button--feature"
              onClick={() => handleBulkAction('feature')}
            >
              Feature
            </button>
            <button 
              className="game-manager__action-button game-manager__action-button--unfeature"
              onClick={() => handleBulkAction('unfeature')}
            >
              Unfeature
            </button>
            <button 
              className="game-manager__action-button game-manager__action-button--delete"
              onClick={() => handleBulkAction('delete')}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      
      {/* Games table */}
      <div className="game-manager__table-container">
        {isLoading ? (
          <div className="game-manager__loading">Loading games...</div>
        ) : filteredGames.length === 0 ? (
          <div className="game-manager__empty">
            {searchQuery || selectedCategory !== 'all' 
              ? 'No games match your filter criteria.' 
              : 'No games available. Add your first game!'}
          </div>
        ) : (
          <table className="game-manager__table">
            <thead>
              <tr>
                <th className="game-manager__checkbox-cell">
                  <input 
                    type="checkbox" 
                    checked={selectedGames.length === filteredGames.length && filteredGames.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Game</th>
                <th>Category</th>
                <th>Creator</th>
                <th>Added</th>
                <th>Plays</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map(game => (
                <tr key={game.id} className={selectedGames.includes(game.id) ? 'is-selected' : ''}>
                  <td className="game-manager__checkbox-cell">
                    <input 
                      type="checkbox" 
                      checked={selectedGames.includes(game.id)}
                      onChange={() => handleSelectGame(game.id)}
                    />
                  </td>
                  <td>
                    <div className="game-manager__game-info">
                      <img 
                        src={game.thumbnail} 
                        alt={game.title}
                        className="game-manager__game-thumb"
                      />
                      <span className="game-manager__game-title">{game.title}</span>
                    </div>
                  </td>
                  <td>{game.category}</td>
                  <td>{game.creator?.name || 'Unknown'}</td>
                  <td>{formatDate(game.dateAdded || game.lastUpdated)}</td>
                  <td>{game.plays.toLocaleString()}</td>
                  <td>
                    <div className="game-manager__rating">
                      <span className="game-manager__rating-value">{game.rating.toFixed(1)}</span>
                      <span className="game-manager__rating-count">({game.ratingCount})</span>
                    </div>
                  </td>
                  <td>
                    <div className="game-manager__actions">
                      <Link 
                        to={`/admin/games/edit/${game.id}`}
                        className="game-manager__action-button game-manager__action-button--edit"
                      >
                        Edit
                      </Link>
                      <Link 
                        to={`/games/${game.id}`}
                        className="game-manager__action-button game-manager__action-button--view"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination (for future implementation) */}
      <div className="game-manager__pagination">
        <span className="game-manager__pagination-info">
          Showing {filteredGames.length} of {games.length} games
        </span>
      </div>
    </div>
  );
};

export default GameManager;