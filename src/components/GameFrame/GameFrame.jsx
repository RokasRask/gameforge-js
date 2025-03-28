import React, { useEffect, useState, useRef } from 'react';
import './GameFrame.scss';

const GameFrame = ({ gameId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const loadGame = async () => {
      try {
        setLoading(true);
        
        // Get game files from localStorage
        const gameFilesStorage = JSON.parse(localStorage.getItem('gameforge-files') || '{}');
        const gameData = gameFilesStorage[gameId];
        
        if (!gameData || !gameData.files || !gameData.files.length) {
          throw new Error('Game files not found');
        }

        // Create files map for easy access
        const filesMap = {};
        gameData.files.forEach(file => {
          filesMap[file.name] = file;
        });

        // Identify HTML, CSS, and JS files
        const htmlFile = gameData.files.find(file => file.name.endsWith('.html'));
        const cssFiles = gameData.files.filter(file => file.name.endsWith('.css'));
        const jsFiles = gameData.files.filter(file => file.name.endsWith('.js'));

        // If no HTML file exists, we need to create one for JS games like Space Invaders
        let htmlContent;
        
        if (htmlFile) {
          // Use the uploaded HTML file
          htmlContent = atob(htmlFile.content.split(',')[1]);
        } else {
          // Create HTML wrapper for JS games
          // This is where we'd insert the HTML structure for games like Space Invaders
          htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Game</title>
                ${cssFiles.map(file => `<style>${atob(file.content.split(',')[1])}</style>`).join('')}
                <style>
                  * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                  }
                  
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #000;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    overflow: hidden;
                  }
                  
                  .game-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 800px;
                    max-width: 100%;
                  }
                  
                  .score-container {
                    font-size: 24px;
                    margin-bottom: 10px;
                    color: #0f0;
                    width: 100%;
                    text-align: left;
                  }
                  
                  canvas {
                    background-color: #000;
                    border: 2px solid #0f0;
                  }
                  
                  .controls {
                    width: 100%;
                    margin-top: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  }
                  
                  .button {
                    background-color: #0f0;
                    color: #000;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-bottom: 15px;
                    transition: all 0.2s ease;
                  }
                  
                  .button:hover {
                    background-color: #fff;
                  }
                  
                  .control-info {
                    text-align: center;
                    color: #0f0;
                    font-size: 14px;
                    line-height: 1.5;
                  }
                </style>
            </head>
            <body>
                <div class="game-container">
                    <div class="score-container">
                        <span>Score: </span>
                        <span id="score">0</span>
                    </div>
                    <canvas id="gameCanvas"></canvas>
                    <div class="controls">
                        <div id="startButton" class="button">Start Game</div>
                        <div id="controls" class="control-info">
                            <p>Use ← → arrows or A/D keys to move</p>
                            <p>Space to shoot</p>
                        </div>
                    </div>
                </div>
                
                ${jsFiles.map(file => `<script>${atob(file.content.split(',')[1])}</script>`).join('')}
            </body>
            </html>
          `;
        }

        // Set the iframe content
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
        
        // Add event listener to handle when iframe is loaded
        iframe.onload = () => {
          setLoading(false);
        };
      } catch (err) {
        console.error('Error loading game:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (gameId) {
      loadGame();
    }
  }, [gameId]);

  if (error) {
    return (
      <div className="game-frame game-frame--error">
        <div className="game-frame__error">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Failed to load game</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-frame">
      {loading && (
        <div className="game-frame__loading">
          <div className="game-frame__spinner"></div>
          <p>Loading game...</p>
        </div>
      )}
      <iframe 
        ref={iframeRef}
        className={`game-frame__iframe ${loading ? 'game-frame__iframe--loading' : ''}`}
        title="Game Frame"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </div>
  );
};

export default GameFrame;