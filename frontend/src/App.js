import React from 'react';
import SwipeDeck from './components/SwipeDeck';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Transactional Love 💘</h1>
        <p className="tagline">Swipe right on financial compatibility</p>
      </header>
      
      <main className="app-main">
        <SwipeDeck />
      </main>
      
      <footer className="app-footer">
        <p>💳 Connect your bank to see more matches</p>
      </footer>
    </div>
  );
}

export default App;
