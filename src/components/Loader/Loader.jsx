import React from 'react';
import './Loader.scss';

const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className={`loader loader--${size}`}>
      <div className="loader__spinner">
        <div className="loader__circle"></div>
        <div className="loader__circle"></div>
        <div className="loader__circle"></div>
      </div>
      {text && <p className="loader__text">{text}</p>}
    </div>
  );
};

export default Loader;