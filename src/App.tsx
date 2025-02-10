import React from 'react';
import { NotificationButton } from './components/NotificationButton/NotificationButton';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Joby</h1>
        <p>Your new Progressive Web App is ready!</p>
      </header>
      {/* Add NotificationButton in the header/navigation area */}
      <div className="fixed top-4 right-4 z-50">
        <NotificationButton />
      </div>
    </div>
  );
}

export default App;
