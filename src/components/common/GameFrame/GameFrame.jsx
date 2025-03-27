import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import gameLoader from '../../utils/gameLoader';
import gameRegistry from '../../utils/gameRegistry';
import Loader from '../common/Loader/Loader';

/**
 * Game frame component for displaying and running games
 * 
 * @param {Object} props - Component props
 * @param {string} props.gameId - ID of the game to load and run (optional if using route params)
 * @param {string} props.title - Title of the game (optional if gameId is provided)
 * @param {Function} props.onClose - Callback for when the game is closed
 * @param {boolean} props.autoStart - Whether to start the game automatically (default: true)
 * @param {string} props.aspectRatio - Aspect ratio of the game frame ('16:9', '4:3', '1:1')
 * @param {boolean} props.showControls - Whether to show the game controls UI
 * @param {boolean} props.crtEffect - Whether to apply the CRT screen effect
 * @param {string} props.className - Additional CSS class names
 */
const GameFrame = ({
  gameId: propGameId,
  title: propTitle,
  onClose,
  autoStart = true,
  aspectRatio = '16:9',
  showControls = true,
  crtEffect = false,
  className = ''
}) => {
  // Get game ID from route params if not provided as prop
  const { id: routeGameId } = useParams();
  const gameId = propGameId || routeGameId;
  
  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [gameInstance, setGameInstance] = useState(null);
  const [gameInfo, setGameInfo] = useState(null);
  
  // References
  const containerRef = useRef(null);
  const gameContainerRef = useRef(null);
  
  // Get game title
  const title = propTitle || gameInfo?.title || 'Game';
  
  // Set container class based on aspect ratio
  let aspectRatioClass = '';
  switch (aspectRatio) {
    case '1:1':
      aspectRatioClass = 'game-frame__container--square';
      break;
    case '4:3':
      aspectRatioClass = 'game-frame__container--standard';
      break;
    default:
      aspectRatioClass = ''; // Default is 16:9
  }
  
  // Load the game when component mounts or gameId changes
  useEffect(() => {
    let isMounted = true;
    
    const loadGame = async () => {
      // Reset states
      setIsLoading(true);
      setError(null);
      setGameInstance(null);
      
      try {
        if (!gameId) {
          throw new Error('Game ID is required');
        }
        
        // Get game info from registry
        const info = gameRegistry.getGameById(gameId);
        if (!info) {
          throw new Error(`Game with ID ${gameId} not found`);
        }
        
        if (isMounted) {
          setGameInfo(info);
        }
        
        // Load the game
        const instance = await gameLoader.loadGame(gameId);
        
        if (isMounted) {
          setGameInstance(instance);
          
          // Initialize the game if the container is ready
          if (gameContainerRef.current && instance) {
            await instance.initialize('game-container');
            
            // Auto-start if enabled
            if (autoStart) {
              instance.start();
            }
          }
        }
      } catch (err) {
        console.error('Error loading game:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load game');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadGame();
    
    // Cleanup when unmounting
    return () => {
      isMounted = false;
      
      // Unload the game when component unmounts
      if (gameId && gameLoader.isGameLoaded(gameId)) {
        gameLoader.unloadGame(gameId);
      }
    };
  }, [gameId, autoStart]);
  
  // Handle container resizing
  useEffect(() => {
    const handleResize = () => {
      if (gameInstance && gameContainerRef.current) {
        const { clientWidth, clientHeight } = gameContainerRef.current;
        gameInstance.resize(clientWidth, clientHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial resize
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [gameInstance]);
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    // Give the browser a moment to update the DOM before resizing
    setTimeout(() => {
      if (gameInstance && gameContainerRef.current) {
        const { clientWidth, clientHeight } = gameContainerRef.current;
        gameInstance.resize(clientWidth, clientHeight);
      }
    }, 100);
  };
  
  // Toggle pause
  const togglePause = () => {
    if (!gameInstance) return;
    
    if (isPaused) {
      gameInstance.resume();
    } else {
      gameInstance.pause();
    }
    
    setIsPaused(!isPaused);
  };
  
  // Toggle mute
  const toggleMute = () => {
    // In a real implementation, this would update the game's audio settings
    setIsMuted(!isMuted);
  };
  
  // Handle close
  const handleClose = () => {
    // Unload the game
    if (gameId && gameLoader.isGameLoaded(gameId)) {
      gameLoader.unloadGame(gameId);
    }
    
    // Call the onClose callback if provided
    if (onClose) {
      onClose();
    }
  };
  
  // Restart the game
  const handleRestart = () => {
    if (!gameInstance) return;
    
    gameInstance.stop();
    
    // Give the game a moment to clean up before restarting
    setTimeout(() => {
      gameInstance.initialize('game-container');
      gameInstance.start();
      setIsPaused(false);
    }, 100);
  };
  
  return (
    <div 
      ref={containerRef}
      className={`game-frame ${isFullscreen ? 'game-frame--fullscreen' : ''} ${crtEffect ? 'game-frame--crt' : ''} ${className}`}
    >
      {/* Game header with controls */}
      {showControls && (
        <div className="game-frame__header">
          <h2 className="game-frame__title">{title}</h2>
          
          <div className="game-frame__controls">
            <button 
              className="game-frame__control-button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            
            <button 
              className="game-frame__control-button"
              onClick={togglePause}
              aria-label={isPaused ? 'Resume' : 'Pause'}
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? '▶️' : '⏸️'}
            </button>
            
            <button 
              className="game-frame__control-button"
              onClick={handleRestart}
              aria-label="Restart"
              title="Restart"
            >
              🔄
            </button>
            
            <button 
              className="game-frame__control-button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? '⤧' : '⤢'}
            </button>
            
            <button 
              className="game-frame__close-button"
              onClick={handleClose}
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Game container */}
      <div 
        className={`game-frame__container ${aspectRatioClass}`}
        ref={gameContainerRef}
      >
        {/* Game canvas container - the game will be rendered here */}
        <div id="game-container" className="game-frame__iframe"></div>
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="game-frame__loading">
            <Loader size="large" color="var(--primary-color)" />
            <p>Loading game...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="game-frame__error">
            <div className="game-frame__error-icon">❌</div>
            <h3 className="game-frame__error-title">Failed to Load Game</h3>
            <p className="game-frame__error-message">{error}</p>
            <button 
              className="game-frame__error-button"
              onClick={handleClose}
            >
              Go Back
            </button>
          </div>
        )}
        
        {/* Pause overlay */}
        {isPaused && !isLoading && !error && (
          <div className="game-frame__pause-overlay">
            <div className="game-frame__pause-icon">⏸️</div>
            <h3 className="game-frame__pause-title">Game Paused</h3>
            <button 
              className="game-frame__pause-button"
              onClick={togglePause}
            >
              Resume
            </button>
          </div>
        )}
      </div>
      
      {/* Game footer with additional controls or info */}
      {showControls && gameInfo && gameInfo.controls && (
        <div className="game-frame__footer">
          <div className="game-frame__hint">
            <strong>Controls:</strong> {' '}
            {Object.entries(gameInfo.controls)
              .map(([key, action]) => `${key}: ${action}`)
              .join(' | ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameFrame;