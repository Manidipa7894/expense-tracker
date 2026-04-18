import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">₹</span>
          <span className="brand-name">SpendWise</span>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Dashboard
          </button>
          <button
            className={`nav-item ${activePage === 'transactions' ? 'active' : ''}`}
            onClick={() => setActivePage('transactions')}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 6h18M3 12h18M3 18h18"/>
            </svg>
            Transactions
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-badge">MERN Stack</div>
        </div>
      </aside>
      <main className="main-content">
        {activePage === 'dashboard' ? <Dashboard /> : <Transactions />}
      </main>
    </div>
  );
}

export default App;
