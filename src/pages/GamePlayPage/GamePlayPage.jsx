import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './GamePlayPage.scss';
import Button from '../../components/Button/Button';
import GameFrame from '../../components/GameFrame/GameFrame';

const GamePlayPage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the game data from localStorage
    const storedGames = localStorage.getItem('gameforge-games');
    if (storedGames) {
      const games = JSON.parse(storedGames);
      const foundGame = games.find(g => g.id === gameId);
      setGame(foundGame);
    }
    setLoading(false);
  }, [gameId]);

  if (loading) {
    return (
      <div className="game-play-loading">
        <div className="game-play-loading__spinner"></div>
        <p>Loading game...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="game-play-error">
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
    <div className="game-play-page">
      <div className="game-play-header">
        <div className="container">
          <Link to="/games" className="game-play-header__back">
            <i className="fas fa-arrow-left"></i> Back to Games
          </Link>
          <h1 className="game-play-header__title">{game.title}</h1>
          <p className="game-play-header__creator">by {game.creator}</p>
        </div>
      </div>

      <div className="container">
        <div className="game-play-content">
          {/* Game frame component */}
          <div className="game-play-container">
            <GameFrame gameId={game.id} />
          </div>

          <div className="game-play-info">
            <div className="game-play-info__section">
              <h2 className="game-play-info__title">Game Description</h2>
              <p className="game-play-info__description">{game.description}</p>
            </div>

            <div className="game-play-info__section">
              <h2 className="game-play-info__title">Controls</h2>
              <div className="game-play-info__controls">
                <div className="game-play-info__control">
                  <i className="fas fa-arrow-left"></i>
                  <span>Move Left</span>
                </div>
                <div className="game-play-info__control">
                  <i className="fas fa-arrow-right"></i>
                  <span>Move Right</span>
                </div>
                <div className="game-play-info__control">
                  <i className="fas fa-keyboard"></i>
                  <span>Space to Shoot</span>
                </div>
              </div>
            </div>
            
            <div className="game-play-info__section">
              <h2 className="game-play-info__title">Game Files</h2>
              <ul className="game-play-info__files">
                {game.gameFiles && game.gameFiles.map((file, index) => (
                  <li key={index} className="game-play-info__file">
                    <i className="fas fa-file-code"></i>
                    <span>{file.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayPage;