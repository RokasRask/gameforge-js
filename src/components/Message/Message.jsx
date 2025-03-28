import React, { useEffect, useState } from 'react';
import './Message.scss';

const Message = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) {
        setTimeout(onClose, 300); // Allow animation to complete before removing
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`message message--${type} ${visible ? 'message--visible' : 'message--hidden'}`}>
      <div className="message__content">
        <span className="message__text">{message}</span>
      </div>
      <button className="message__close" onClick={() => setVisible(false)}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Message;