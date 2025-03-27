/**
 * GameLoader.js
 * Handles dynamic loading of games and their resources
 */

import gameRegistry from './gameRegistry';

// Base path to game library
const GAMES_BASE_PATH = '/games/library';

/**
 * GameLoader class for dynamically loading and managing game instances
 */
class GameLoader {
  constructor() {
    this.loadedGames = new Map();
    this.loadingPromises = new Map();
    this.activeGame = null;
  }

  /**
   * Load a game by its ID
   * @param {string} gameId - Game ID to load
   * @returns {Promise<Object>} Promise resolving to the game instance
   */
  async loadGame(gameId) {
    // Check if the game is already loaded
    if (this.loadedGames.has(gameId)) {
      console.log(`Game ${gameId} already loaded, returning cached instance`);
      return this.loadedGames.get(gameId);
    }
    
    // Check if the game is currently loading
    if (this.loadingPromises.has(gameId)) {
      console.log(`Game ${gameId} is already loading, waiting for it to complete`);
      return this.loadingPromises.get(gameId);
    }
    
    // Start loading the game
    console.log(`Loading game ${gameId}`);
    
    // Create a loading promise for this game
    const loadingPromise = this._loadGameImplementation(gameId);
    this.loadingPromises.set(gameId, loadingPromise);
    
    try {
      // Wait for the game to load
      const gameInstance = await loadingPromise;
      
      // Store the loaded game
      this.loadedGames.set(gameId, gameInstance);
      
      // Increment play count
      gameRegistry.incrementPlayCount(gameId);
      
      // Set as active game
      this.activeGame = gameId;
      
      return gameInstance;
    } catch (error) {
      console.error(`Failed to load game ${gameId}:`, error);
      throw error;
    } finally {
      // Clean up the loading promise
      this.loadingPromises.delete(gameId);
    }
  }

  /**
   * Actual implementation of game loading logic
   * @param {string} gameId - Game ID to load
   * @returns {Promise<Object>} Promise resolving to the game instance
   * @private
   */
  async _loadGameImplementation(gameId) {
    try {
      // Get game metadata
      const gameMetadata = gameRegistry.getGameById(gameId);
      
      if (!gameMetadata) {
        throw new Error(`Game ${gameId} not found`);
      }
      
      // In a real implementation, this would dynamically import the game module
      // For development, we'll simulate the game loading process
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock game instance
      const gameInstance = {
        id: gameId,
        title: gameMetadata.title,
        initialize: async (containerId) => {
          console.log(`Initializing game ${gameId} in container ${containerId}`);
          
          // Simulate game initialization
          const container = document.getElementById(containerId);
          if (container) {
            // Clear container
            container.innerHTML = '';
            
            // Add mock game content
            const gameCanvas = document.createElement('canvas');
            gameCanvas.width = container.clientWidth;
            gameCanvas.height = container.clientHeight;
            gameCanvas.style.display = 'block';
            gameCanvas.style.backgroundColor = '#000';
            
            container.appendChild(gameCanvas);
            
            // Draw something on the canvas to indicate it's working
            const ctx = gameCanvas.getContext('2d');
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
            
            // Draw game title
            ctx.fillStyle = '#fff';
            ctx.font = '20px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(gameMetadata.title, gameCanvas.width / 2, gameCanvas.height / 2);
            
            // Draw "Loading..." text
            ctx.font = '12px "Press Start 2P", monospace';
            ctx.fillText('Game loaded successfully!', gameCanvas.width / 2, gameCanvas.height / 2 + 40);
            
            // In a real implementation, this would initialize the actual game engine
            // and load necessary assets
            
            return true;
          }
          
          return false;
        },
        start: () => {
          console.log(`Starting game ${gameId}`);
          // In a real implementation, this would start the game loop
          return true;
        },
        pause: () => {
          console.log(`Pausing game ${gameId}`);
          // In a real implementation, this would pause the game
          return true;
        },
        resume: () => {
          console.log(`Resuming game ${gameId}`);
          // In a real implementation, this would resume the game
          return true;
        },
        stop: () => {
          console.log(`Stopping game ${gameId}`);
          // In a real implementation, this would stop the game and clean up resources
          return true;
        },
        resize: (width, height) => {
          console.log(`Resizing game ${gameId} to ${width}x${height}`);
          // In a real implementation, this would resize the game canvas/viewport
          return true;
        },
        // Add mock methods for gameplay
        submitScore: (score) => {
          console.log(`Submitting score ${score} for game ${gameId}`);
          // In a real implementation, this would submit the score to the server
          return true;
        }
      };
      
      console.log(`Game ${gameId} loaded successfully`);
      return gameInstance;
    } catch (error) {
      console.error(`Error in _loadGameImplementation for ${gameId}:`, error);
      throw error;
    }
  }

  /**
   * Unload a game and free its resources
   * @param {string} gameId - Game ID to unload
   * @returns {boolean} Success status
   */
  unloadGame(gameId) {
    if (!this.loadedGames.has(gameId)) {
      console.warn(`Game ${gameId} is not loaded, nothing to unload`);
      return false;
    }
    
    try {
      const gameInstance = this.loadedGames.get(gameId);
      
      // Stop the game if it's running
      if (gameInstance && typeof gameInstance.stop === 'function') {
        gameInstance.stop();
      }
      
      // Remove from loaded games
      this.loadedGames.delete(gameId);
      
      // Clear active game if this was it
      if (this.activeGame === gameId) {
        this.activeGame = null;
      }
      
      console.log(`Game ${gameId} unloaded successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to unload game ${gameId}:`, error);
      return false;
    }
  }

  /**
   * Get the currently active game
   * @returns {Object|null} Active game instance or null if none
   */
  getActiveGame() {
    if (!this.activeGame) {
      return null;
    }
    
    return this.loadedGames.get(this.activeGame) || null;
  }

  /**
   * Pause the currently active game
   * @returns {boolean} Success status
   */
  pauseActiveGame() {
    const activeGame = this.getActiveGame();
    
    if (!activeGame || typeof activeGame.pause !== 'function') {
      return false;
    }
    
    return activeGame.pause();
  }

  /**
   * Resume the currently active game
   * @returns {boolean} Success status
   */
  resumeActiveGame() {
    const activeGame = this.getActiveGame();
    
    if (!activeGame || typeof activeGame.resume !== 'function') {
      return false;
    }
    
    return activeGame.resume();
  }

  /**
   * Stop and unload all games
   * @returns {boolean} Success status
   */
  unloadAllGames() {
    try {
      // Get all loaded game IDs
      const gameIds = Array.from(this.loadedGames.keys());
      
      // Unload each game
      gameIds.forEach(gameId => this.unloadGame(gameId));
      
      // Clear active game
      this.activeGame = null;
      
      return true;
    } catch (error) {
      console.error('Failed to unload all games:', error);
      return false;
    }
  }

  /**
   * Check if a game is currently loaded
   * @param {string} gameId - Game ID to check
   * @returns {boolean} True if the game is loaded
   */
  isGameLoaded(gameId) {
    return this.loadedGames.has(gameId);
  }

  /**
   * Get all currently loaded games
   * @returns {Array} Array of loaded game IDs
   */
  getLoadedGames() {
    return Array.from(this.loadedGames.keys());
  }
}

// Create and export singleton instance
const gameLoader = new GameLoader();
export default gameLoader;