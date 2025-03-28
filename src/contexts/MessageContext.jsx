import React, { createContext, useState, useContext } from 'react';
import Message from '../components/Message/Message';

// Create context
const MessageContext = createContext();

// Message provider component
export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  // Add a message to the queue
  const addMessage = (message, type = 'success', duration = 3000) => {
    const id = Date.now(); // Simple unique ID
    setMessages(prev => [...prev, { id, message, type, duration }]);
    
    // Automatically remove message after duration + animation time
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== id));
    }, duration + 300);
  };

  // Remove a message from the queue
  const removeMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return (
    <MessageContext.Provider value={{ addMessage, removeMessage }}>
      {children}
      <div className="message-container">
        {messages.map(({ id, message, type, duration }) => (
          <Message
            key={id}
            message={message}
            type={type}
            duration={duration}
            onClose={() => removeMessage(id)}
          />
        ))}
      </div>
    </MessageContext.Provider>
  );
};

// Custom hook for using messages
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

export default MessageContext;