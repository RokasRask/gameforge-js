/**
 * GameRegistry.js
 * Manages the registry of all games in the platform
 */

// Mock directory for development - in production would use API calls
const GAMES_METADATA_DIR = '/games/metadata';

/**
 * GameRegistry class for managing all games metadata
 */
class GameRegistry {
  constructor() {
    this.games = [];
    this.initialized = false;
    this.categories = new Map();
    this.tags = new Map();
    this.creators = new Map();
  }

  /**
   * Initialize the game registry by loading all game metadata
   * @returns {Promise<Array>} Promise resolving to the games array
   */
  async initialize() {
    if (this.initialized) {
      return this.games;
    }

    try {
      // In a real implementation, this would be an API call to fetch all game metadata
      const games = await this.fetchAllGamesMetadata();
      this.games = games;
      
      // Build indices for fast filtering
      this.buildIndices();
      
      this.initialized = true;
      return this.games;
    } catch (error) {
      console.error('Failed to initialize game registry:', error);
      throw error;
    }
  }

  /**
   * Build indices for fast filtering and searching
   */
  buildIndices() {
    // Clear existing indices
    this.categories.clear();
    this.tags.clear();
    this.creators.clear();
    
    // Build new indices
    this.games.forEach(game => {
      // Category index
      if (game.category) {
        if (!this.categories.has(game.category)) {
          this.categories.set(game.category, []);
        }
        this.categories.get(game.category).push(game.id);
      }
      
      // Tags index
      if (game.tags && Array.isArray(game.tags)) {
        game.tags.forEach(tag => {
          if (!this.tags.has(tag)) {
            this.tags.set(tag, []);
          }
          this.tags.get(tag).push(game.id);
        });
      }
      
      // Creator index
      if (game.creator && game.creator.name) {
        const creatorName = game.creator.name;
        if (!this.creators.has(creatorName)) {
          this.creators.set(creatorName, []);
        }
        this.creators.get(creatorName).push(game.id);
      }
    });
  }

  /**
   * Fetch all games metadata from storage
   * @returns {Promise<Array>} Array of game metadata objects
   */
  async fetchAllGamesMetadata() {
    try {
      // In production, this would be an API call
      // For development, we'll use a mock implementation
      return mockGamesData;
    } catch (error) {
      console.error('Error fetching games metadata:', error);
      throw error;
    }
  }

  /**
   * Get all available games
   * @returns {Array} Array of game objects
   */
  getAllGames() {
    return [...this.games];
  }

  /**
   * Get a game by its ID
   * @param {string} id - Game ID
   * @returns {Object|null} Game object or null if not found
   */
  getGameById(id) {
    return this.games.find(game => game.id === id) || null;
  }

  /**
   * Get games by category
   * @param {string} category - Category name
   * @returns {Array} Array of games in the specified category
   */
  getGamesByCategory(category) {
    if (!this.categories.has(category)) {
      return [];
    }
    
    const gameIds = this.categories.get(category);
    return this.games.filter(game => gameIds.includes(game.id));
  }

  /**
   * Get games by tag
   * @param {string} tag - Tag name
   * @returns {Array} Array of games with the specified tag
   */
  getGamesByTag(tag) {
    if (!this.tags.has(tag)) {
      return [];
    }
    
    const gameIds = this.tags.get(tag);
    return this.games.filter(game => gameIds.includes(game.id));
  }

  /**
   * Get games by creator
   * @param {string} creatorName - Creator name
   * @returns {Array} Array of games by the specified creator
   */
  getGamesByCreator(creatorName) {
    if (!this.creators.has(creatorName)) {
      return [];
    }
    
    const gameIds = this.creators.get(creatorName);
    return this.games.filter(game => gameIds.includes(game.id));
  }

  /**
   * Search games by query string
   * @param {string} query - Search query
   * @returns {Array} Array of games matching the search query
   */
  searchGames(query) {
    if (!query || typeof query !== 'string') {
      return this.getAllGames();
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return this.games.filter(game => {
      // Match by title
      if (game.title.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      
      // Match by description
      if (game.description.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      
      // Match by category
      if (game.category.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      
      // Match by tags
      if (game.tags && game.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))) {
        return true;
      }
      
      // Match by creator name
      if (game.creator && game.creator.name.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      
      return false;
    });
  }

  /**
   * Filter games with multiple criteria
   * @param {Object} filters - Filter criteria
   * @param {string} filters.category - Category filter
   * @param {Array} filters.tags - Tags filter (array of tag strings)
   * @param {string} filters.creator - Creator name filter
   * @param {string} filters.query - Search query
   * @returns {Array} Filtered games array
   */
  filterGames(filters = {}) {
    let filteredGames = this.getAllGames();
    
    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filteredGames = filteredGames.filter(game => game.category === filters.category);
    }
    
    // Filter by tags (if any tag matches)
    if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
      filteredGames = filteredGames.filter(game => 
        game.tags && game.tags.some(tag => filters.tags.includes(tag))
      );
    }
    
    // Filter by creator
    if (filters.creator) {
      filteredGames = filteredGames.filter(game => 
        game.creator && game.creator.name === filters.creator
      );
    }
    
    // Filter by search query
    if (filters.query) {
      const queryResults = this.searchGames(filters.query);
      const queryGameIds = queryResults.map(game => game.id);
      filteredGames = filteredGames.filter(game => queryGameIds.includes(game.id));
    }
    
    return filteredGames;
  }

  /**
   * Sort games by specified criteria
   * @param {Array} games - Array of games to sort
   * @param {string} sortBy - Sort criteria (rating, plays, newest, oldest)
   * @returns {Array} Sorted games array
   */
  sortGames(games, sortBy = 'newest') {
    const sortedGames = [...games];
    
    switch (sortBy) {
      case 'rating':
        return sortedGames.sort((a, b) => b.rating - a.rating);
        
      case 'plays':
        return sortedGames.sort((a, b) => b.plays - a.plays);
        
      case 'newest':
        return sortedGames.sort((a, b) => {
          const dateA = new Date(a.dateAdded || a.lastUpdated);
          const dateB = new Date(b.dateAdded || b.lastUpdated);
          return dateB - dateA;
        });
        
      case 'oldest':
        return sortedGames.sort((a, b) => {
          const dateA = new Date(a.dateAdded || a.lastUpdated);
          const dateB = new Date(b.dateAdded || b.lastUpdated);
          return dateA - dateB;
        });
        
      case 'alphabetical':
        return sortedGames.sort((a, b) => a.title.localeCompare(b.title));
        
      default:
        return sortedGames;
    }
  }

  /**
   * Update game play count
   * @param {string} gameId - Game ID
   * @returns {Promise<boolean>} Success status
   */
  async incrementPlayCount(gameId) {
    try {
      const gameIndex = this.games.findIndex(game => game.id === gameId);
      
      if (gameIndex === -1) {
        return false;
      }
      
      // Update local registry
      this.games[gameIndex] = {
        ...this.games[gameIndex],
        plays: (this.games[gameIndex].plays || 0) + 1
      };
      
      // In production, this would make an API call to update the play count in the database
      // For development, we just log the update
      console.log(`Updated play count for game ${gameId} to ${this.games[gameIndex].plays}`);
      
      return true;
    } catch (error) {
      console.error(`Failed to update play count for game ${gameId}:`, error);
      return false;
    }
  }

  /**
   * Update game rating
   * @param {string} gameId - Game ID
   * @param {number} rating - New rating value (0-5)
   * @returns {Promise<boolean>} Success status
   */
  async updateGameRating(gameId, rating) {
    try {
      const gameIndex = this.games.findIndex(game => game.id === gameId);
      
      if (gameIndex === -1) {
        return false;
      }
      
      // Calculate new rating average
      const currentRating = this.games[gameIndex].rating || 0;
      const currentCount = this.games[gameIndex].ratingCount || 0;
      
      const newCount = currentCount + 1;
      const newAverage = ((currentRating * currentCount) + rating) / newCount;
      
      // Update local registry
      this.games[gameIndex] = {
        ...this.games[gameIndex],
        rating: newAverage,
        ratingCount: newCount
      };
      
      // In production, this would make an API call to update the rating in the database
      console.log(`Updated rating for game ${gameId} to ${newAverage} (${newCount} ratings)`);
      
      return true;
    } catch (error) {
      console.error(`Failed to update rating for game ${gameId}:`, error);
      return false;
    }
  }

  /**
   * Get all available categories with counts
   * @returns {Array} Array of category objects with counts
   */
  getAllCategories() {
    const categoriesWithCounts = [];
    
    this.categories.forEach((gameIds, category) => {
      categoriesWithCounts.push({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        count: gameIds.length
      });
    });
    
    return categoriesWithCounts.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get most popular tags with counts
   * @param {number} limit - Maximum number of tags to return
   * @returns {Array} Array of tag objects with counts
   */
  getPopularTags(limit = 10) {
    const tagsWithCounts = [];
    
    this.tags.forEach((gameIds, tag) => {
      tagsWithCounts.push({
        id: tag,
        name: tag,
        count: gameIds.length
      });
    });
    
    return tagsWithCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get featured games (games with highest ratings or manually featured)
   * @param {number} limit - Maximum number of games to return
   * @returns {Array} Array of featured game objects
   */
  getFeaturedGames(limit = 3) {
    // In a real implementation, we might have a "featured" flag in the metadata
    // For now, we'll just return the highest rated games
    return [...this.games]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }
}

// Create and export singleton instance
const gameRegistry = new GameRegistry();

// Mock game data for development (would be fetched from server in production)
// This will be replaced with actual backend calls in production
const mockGamesData = [
  {
    id: "pixel-platformer",
    title: "Pixel Platformer",
    slug: "pixel-platformer",
    description: "Jump and run through challenging levels in this retro platformer. Collect coins, avoid enemies, and reach the exit in each level.",
    longDescription: "Pixel Platformer is an 8-bit style platformer game that combines classic gameplay with modern mechanics. The game features 20 challenging levels, various enemies with unique behaviors, power-ups and special abilities, retro pixel art and chiptune music, and collectibles and secrets to discover.",
    thumbnail: "https://via.placeholder.com/350x200/3498db/ffffff?text=Pixel+Platformer",
    screenshots: [
      "https://via.placeholder.com/800x450/3498db/ffffff?text=Pixel+Platformer+Screenshot+1",
      "https://via.placeholder.com/800x450/2980b9/ffffff?text=Pixel+Platformer+Screenshot+2"
    ],
    category: "platformer",
    tags: ["platformer", "action", "retro", "pixel-art"],
    creator: {
      name: "RetroDevs",
      website: "https://retrodevs.example.com"
    },
    controls: {
      "Arrow Keys": "Move",
      "Space": "Jump",
      "Z": "Attack"
    },
    rating: 4.5,
    ratingCount: 28,
    plays: 1250,
    dateAdded: "2023-09-15T12:00:00Z",
    lastUpdated: "2023-10-20T14:30:00Z"
  },
  {
    id: "space-shooter",
    title: "Space Shooter",
    slug: "space-shooter",
    description: "Defend Earth from alien invaders in this classic arcade shooter. Upgrade your ship and battle through waves of enemies.",
    longDescription: "Space Shooter is a fast-paced arcade game where you pilot the last defender spacecraft against waves of alien invaders. Features include multiple enemy types, boss battles, ship upgrades and power-ups, and an original chiptune soundtrack.",
    thumbnail: "https://via.placeholder.com/350x200/e74c3c/ffffff?text=Space+Shooter",
    screenshots: [
      "https://via.placeholder.com/800x450/e74c3c/ffffff?text=Space+Shooter+Screenshot+1",
      "https://via.placeholder.com/800x450/c0392b/ffffff?text=Space+Shooter+Screenshot+2"
    ],
    category: "arcade",
    tags: ["arcade", "shooter", "space", "action"],
    creator: {
      name: "ArcadeWizards",
      website: "https://arcadewizards.example.com"
    },
    controls: {
      "Arrow Keys": "Move",
      "Space": "Fire",
      "X": "Special Weapon"
    },
    rating: 4.2,
    ratingCount: 19,
    plays: 980,
    dateAdded: "2023-08-22T15:30:00Z",
    lastUpdated: "2023-09-05T10:15:00Z"
  },
  {
    id: "puzzle-quest",
    title: "Puzzle Quest",
    slug: "puzzle-quest",
    description: "Solve mind-bending puzzles in this brain-teasing adventure. Navigate through increasingly complex challenges.",
    longDescription: "Puzzle Quest combines the best of puzzle mechanics with adventure elements. Each level presents a unique challenge requiring logical thinking and clever problem-solving. The game features 50+ unique puzzles, an engaging storyline, beautiful pixel art aesthetics, and unlockable bonus content.",
    thumbnail: "https://via.placeholder.com/350x200/2ecc71/ffffff?text=Puzzle+Quest",
    screenshots: [
      "https://via.placeholder.com/800x450/2ecc71/ffffff?text=Puzzle+Quest+Screenshot+1",
      "https://via.placeholder.com/800x450/27ae60/ffffff?text=Puzzle+Quest+Screenshot+2"
    ],
    category: "puzzle",
    tags: ["puzzle", "logic", "adventure", "strategy"],
    creator: {
      name: "PuzzleMakers",
      website: "https://puzzlemakers.example.com"
    },
    controls: {
      "Mouse": "Select and Drag",
      "R": "Reset Puzzle",
      "H": "Hint"
    },
    rating: 4.7,
    ratingCount: 32,
    plays: 1540,
    dateAdded: "2023-10-05T09:45:00Z",
    lastUpdated: "2023-10-05T09:45:00Z"
  },
  {
    id: "retro-rpg",
    title: "Retro RPG",
    slug: "retro-rpg",
    description: "Embark on an epic quest in this turn-based role-playing game. Explore a vast world, battle monsters, and discover treasures.",
    longDescription: "Retro RPG captures the essence of classic role-playing games with modern gameplay elements. Create your character, explore a vast world, battle in turn-based combat, and uncover an epic storyline. Features include character customization, multiple endings, crafting system, and a day/night cycle affecting gameplay.",
    thumbnail: "https://via.placeholder.com/350x200/9b59b6/ffffff?text=Retro+RPG",
    screenshots: [
      "https://via.placeholder.com/800x450/9b59b6/ffffff?text=Retro+RPG+Screenshot+1",
      "https://via.placeholder.com/800x450/8e44ad/ffffff?text=Retro+RPG+Screenshot+2"
    ],
    category: "rpg",
    tags: ["rpg", "adventure", "turn-based", "fantasy"],
    creator: {
      name: "QuestFoundry",
      website: "https://questfoundry.example.com"
    },
    controls: {
      "Arrow Keys": "Move",
      "Space/Enter": "Interact",
      "ESC": "Menu"
    },
    rating: 4.9,
    ratingCount: 45,
    plays: 2100,
    dateAdded: "2023-10-12T14:20:00Z",
    lastUpdated: "2023-10-18T11:30:00Z"
  },
  {
    id: "strategy-master",
    title: "Strategy Master",
    slug: "strategy-master",
    description: "Plan, build, and conquer in this challenging strategy game. Manage resources and outsmart your opponents.",
    longDescription: "Strategy Master is a turn-based strategy game inspired by classic 4X games. Build your civilization, manage resources, research technologies, and defeat rival nations through diplomacy or warfare. Features include procedurally generated maps, multiple victory conditions, and advanced AI opponents.",
    thumbnail: "https://via.placeholder.com/350x200/f39c12/ffffff?text=Strategy+Master",
    screenshots: [
      "https://via.placeholder.com/800x450/f39c12/ffffff?text=Strategy+Master+Screenshot+1",
      "https://via.placeholder.com/800x450/d35400/ffffff?text=Strategy+Master+Screenshot+2"
    ],
    category: "strategy",
    tags: ["strategy", "turn-based", "resource-management", "4X"],
    creator: {
      name: "StrategyGuild",
      website: "https://strategyguild.example.com"
    },
    controls: {
      "Mouse": "Select and Command",
      "WASD": "Pan Camera",
      "T": "Tech Tree"
    },
    rating: 4.3,
    ratingCount: 17,
    plays: 870,
    dateAdded: "2023-09-28T08:15:00Z",
    lastUpdated: "2023-10-10T13:45:00Z"
  },
  {
    id: "pixel-sports",
    title: "Pixel Sports",
    slug: "pixel-sports",
    description: "Compete in various sports events with simple yet addictive gameplay. Challenge friends in multiplayer matches.",
    longDescription: "Pixel Sports brings the excitement of athletic competition to your browser with pixelated charm. Play solo or against friends in a variety of sports disciplines. The game includes 8 different sports events, local multiplayer support, online leaderboards, and unlockable characters with unique abilities.",
    thumbnail: "https://via.placeholder.com/350x200/1abc9c/ffffff?text=Pixel+Sports",
    screenshots: [
      "https://via.placeholder.com/800x450/1abc9c/ffffff?text=Pixel+Sports+Screenshot+1",
      "https://via.placeholder.com/800x450/16a085/ffffff?text=Pixel+Sports+Screenshot+2"
    ],
    category: "sports",
    tags: ["sports", "multiplayer", "competitive", "arcade"],
    creator: {
      name: "PixelAthletes",
      website: "https://pixelathletes.example.com"
    },
    controls: {
      "Arrow Keys": "Move",
      "Space": "Action/Jump",
      "Enter": "Start/Pause"
    },
    rating: 4.0,
    ratingCount: 24,
    plays: 750,
    dateAdded: "2023-09-10T16:45:00Z",
    lastUpdated: "2023-09-22T09:20:00Z"
  }
];

// Initialize registry with mock data
gameRegistry.initialize();

export default gameRegistry;