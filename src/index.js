import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import global styles
import './styles/main.scss';

// Make sure the DOM is fully loaded before mounting
document.addEventListener('DOMContentLoaded', () => {
    // Mount React App
    const container = document.getElementById('root');

    // Check if the root element exists
    if (container) {
        const root = createRoot(container);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );

        // Register service worker for PWA support
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(registration => {
                        console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch(error => {
                        console.error('Service Worker registration failed:', error);
                    });
            });
        }
    } else {
        console.error('Could not find root element to mount React application');
    }
});