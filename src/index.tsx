import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('Service Worker registration successful');
  },
  onUpdate: (registration) => {
    // Show update notification to user
    const shouldUpdate = window.confirm(
      'A new version of Joby is available! Would you like to update now?'
    );
    
    if (shouldUpdate && registration.waiting) {
      // Send message to service worker to skip waiting and activate new version
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload all tabs to get the new version
      window.location.reload();
    }
  },
});
