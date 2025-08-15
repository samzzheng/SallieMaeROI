import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import SingleAnalysis from './components/SingleAnalysis';
import ComparisonPage from './components/ComparisonPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src="/sallie_mae.png" alt="Sallie Mae Logo" className="logo" />
          <h1>College ROI Calculator</h1>
        </header>
        
        <Navigation />
        
        <main className="App-main">
          <Routes>
            <Route path="/" element={<SingleAnalysis />} />
            <Route path="/compare" element={<ComparisonPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;