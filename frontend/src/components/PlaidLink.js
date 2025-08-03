import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockUsers } from '../mockData';
import './PlaidLink.css';

const PlaidLink = ({ onSuccess, onExit }) => {
  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedBank, setSelectedBank] = useState(null);

  // Mock banks
  const banks = [
    { id: 'chase', name: 'Chase', color: '#117ACA' },
    { id: 'bofa', name: 'Bank of America', color: '#012169' },
    { id: 'wells', name: 'Wells Fargo', color: '#BA0020' },
    { id: 'citi', name: 'Citi', color: '#003B7F' },
    { id: 'venmo', name: 'Venmo', color: '#3D95CE' },
    { id: 'cashapp', name: 'Cash App', color: '#00C244' },
  ];

  // Simulate connection progress
  useEffect(() => {
    if (isConnecting && progress < 100) {
      const timer = setTimeout(() => {
        const increment = Math.random() * 15 + 5;
        setProgress(Math.min(progress + increment, 100));
      }, 300);
      return () => clearTimeout(timer);
    } else if (progress >= 100) {
      setTimeout(() => onSuccess(mockUsers[0]), 500);
    }
  }, [isConnecting, progress, onSuccess]);

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setTimeout(() => setStep(2), 500);
  };

  const handleConnect = () => {
    setIsConnecting(true);
  };

  return (
    <div className="plaid-link-container">
      <div className="plaid-header">
        <h2>Connect your bank</h2>
        <p>Securely link your account to find your financial match</p>
      </div>

      {step === 1 && (
        <div className="bank-selection">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search your bank..." 
              className="search-input"
            />
          </div>
          
          <div className="bank-list">
            {banks.map((bank) => (
              <motion.div 
                key={bank.id}
                className={`bank-card ${selectedBank?.id === bank.id ? 'selected' : ''}`}
                onClick={() => handleBankSelect(bank)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ '--bank-color': bank.color }}
              >
                <div className="bank-logo" style={{ backgroundColor: bank.color }}>
                  {bank.name[0]}
                </div>
                <span>{bank.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedBank && (
        <div className="bank-login">
          <div className="bank-header" style={{ backgroundColor: selectedBank.color }}>
            <div className="bank-logo">{selectedBank.name[0]}</div>
            <h3>{selectedBank.name}</h3>
          </div>
          
          {!isConnecting ? (
            <div className="login-form">
              <div className="input-group">
                <label>Username</label>
                <input type="text" placeholder="Enter username" className="login-input" />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="Enter password" className="login-input" />
              </div>
              <button 
                className="connect-button"
                onClick={handleConnect}
                style={{ backgroundColor: selectedBank.color }}
              >
                Connect
              </button>
            </div>
          ) : (
            <div className="connection-status">
              <div className="spinner">
                <div className="spinner-circle"></div>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${progress}%`, backgroundColor: selectedBank.color }}
                ></div>
              </div>
              <p>Connecting to {selectedBank.name}...</p>
              <p className="status-text">
                {progress < 25 && 'Initializing secure connection...'}
                {progress >= 25 && progress < 50 && 'Verifying credentials...'}
                {progress >= 50 && progress < 75 && 'Fetching transaction history...'}
                {progress >= 75 && progress < 100 && 'Analyzing spending patterns...'}
                {progress === 100 && 'Connected! Redirecting...'}
              </p>
            </div>
          )}
        </div>
      )}

      <button className="back-button" onClick={onExit}>
        ← Back to app
      </button>
    </div>
  );
};

export default PlaidLink;
