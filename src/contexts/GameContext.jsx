import React, { createContext, useState, useEffect } from 'react';

// Create game context
export const GameContext = createContext({
  games: [],
  featuredGames: [],
  recentlyPlayed: [],
  favorites: [],
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  recordGamePlay: () => {},
});

// Game provider component
export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load games data on initial render
  useEffect(() => {
    const loadGames = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockGames = [
          {
            id: 'game1',
            title: 'Pixel Platformer',
            thumbnail: '/assets/images/games/pixel-platformer.png',
            description: 'Jump and run through challenging levels in this retro platformer.',
            category: 'platformer',
            rating: 4.5,
            plays: 1250,
            tags: ['platformer', 'action', 'retro'],
            createdAt: '2023-09-15T12:00:00Z'
          },
          {
            id: 'game2',
            title: 'Space Shooter',
            thumbnail: '/assets/images/games/space-shooter.png',
            description: 'Defend Earth from alien invaders in this classic arcade shooter.',
            category: 'arcade',
            rating: 4.2,
            plays: 980,
            tags: ['arcade', 'shooter', 'space'],
            createdAt: '2023-08-22T15:30:00Z'
          },
          {
            id: 'game3',
            title: 'Puzzle Quest',
            thumbnail: '/assets/images/games/puzzle-quest.png',
            description: 'Solve mind-bending puzzles in this brain-teasing adventure.',
            category: 'puzzle',
            rating: 4.7,
            plays: 1540,
            tags: ['puzzle', 'strategy', 'adventure'],
            createdAt: '2023-10-05T09:45:00Z'
          },
        ];
        
        setGames(mockGames);
        
        // Set featured games (for example, top rated)
        setFeaturedGames(mockGames.slice(0, 2));
        
        // Load user-specific data from localStorage
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
        
        const storedRecentlyPlayed = localStorage.getItem('recentlyPlayed');
        if (storedRecentlyPlayed) {
          setRecentlyPlayed(JSON.parse(storedRecentlyPlayed));
        }
      } catch (error) {
        console.error('Error loading games:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGames();
  }, []);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  // Save recently played to localStorage when they change
  useEffect(() => {
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);
  
  // Add a game to favorites
  const addToFavorites = (gameId) => {
    if (!favorites.includes(gameId)) {
      setFavorites([...favorites, gameId]);
    }
  };
  
  // Remove a game from favorites
  const removeFromFavorites = (gameId) => {
    setFavorites(favorites.filter(id => id !== gameId));
  };
  
  // Record a game play
  const recordGamePlay = (gameId) => {
    // Update recently played list
    const updatedRecent = [gameId, ...recentlyPlayed.filter(id => id !== gameId)].slice(0, 10);
    setRecentlyPlayed(updatedRecent);
    
    // In a real app, you would also send an API request to increment the play count
  };
  
  // Context value
  const value = {
    games,
    featuredGames,
    recentlyPlayed,
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    recordGamePlay,
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;