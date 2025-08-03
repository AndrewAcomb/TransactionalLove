import React, { useState, useRef, useEffect } from 'react';
import { mockUsers, getMockPlaidData, processChatMessage } from '../mockData';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import './SwipeDeck.css';
import PlaidLink from './PlaidLink';
import Chatbot from './Chatbot';

const SwipeDeck = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [showPlaid, setShowPlaid] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [direction, setDirection] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const controls = useAnimation();
  const currentCardRef = useRef();
  const [isConnected, setIsConnected] = useState(false);
  
  // Initialize with empty profiles
  useEffect(() => {
    if (isConnected && profiles.length === 0) {
      // Shuffle profiles for variety
      const shuffled = [...mockUsers].sort(() => 0.5 - Math.random());
      setProfiles(shuffled);
    }
  }, [isConnected, profiles.length]);
  
  const currentProfile = profiles[currentIndex];
  
  // Set current user for chatbot when profile changes
  useEffect(() => {
    if (currentProfile) {
      setCurrentUser({
        ...currentProfile,
        ...getMockPlaidData(currentProfile.id).user
      });
    }
  }, [currentProfile]);
  
  const handlePlaidSuccess = (userData) => {
    setIsConnected(true);
    setShowPlaid(false);
    // Add slight delay before showing first profile
    setTimeout(() => {
      setCurrentIndex(0);
    }, 300);
  };
  
  const handleOpenChatbot = () => {
    setShowChatbot(true);
  };
  
  const handleCloseChatbot = () => {
    setShowChatbot(false);
  };

  const handleDragEnd = async (event, info) => {
    if (isAnimating || !isConnected) return;
    
    const threshold = 100;
    const offsetX = info.offset.x;
    
    if (Math.abs(offsetX) > threshold) {
      setIsAnimating(true);
      const direction = offsetX > 0 ? 'right' : 'left';
      setDirection(direction);
      
      // Animate card out
      await controls.start({
        x: `${direction === 'right' ? 500 : -500}px`,
        opacity: 0,
        rotate: direction === 'right' ? 30 : -30,
        transition: { duration: 0.3 }
      });
      
      // Move to next card
      setCurrentIndex(prev => {
        const newIndex = prev + 1;
        if (newIndex >= profiles.length) {
          // Reset if we've gone through all cards
          setTimeout(() => {
            setCurrentIndex(0);
            setIsAnimating(false);
          }, 300);
          return prev;
        }
        return newIndex;
      });
      
      // Reset animation
      setTimeout(() => {
        controls.start({ x: 0, opacity: 1, rotate: 0 });
        setIsAnimating(false);
      }, 300);
    }
  };


  
  // Show connect screen if not connected
  if (!isConnected) {
    return (
      <div className="connect-screen">
        <div className="connect-content">
          <h2>Connect Your Bank</h2>
          <p>Link your account to start swiping on financial compatibility</p>
          <button 
            className="connect-button"
            onClick={() => setShowPlaid(true)}
          >
            🔗 Connect with Plaid
          </button>
          <div className="mock-data-note">
            <small>Don't worry, this is just a demo. No real bank connection needed!</small>
          </div>
        </div>
        
        {showPlaid && (
          <div className="plaid-overlay">
            <PlaidLink 
              onSuccess={handlePlaidSuccess} 
              onExit={() => setShowPlaid(false)} 
            />
          </div>
        )}
      </div>
    );
  }
  
  if (!currentProfile) {
    return (
      <div className="no-more-profiles">
        <h3>No more profiles!</h3>
        <p>Check back later for new matches or refresh to start over</p>
        <button 
          className="refresh-button"
          onClick={() => window.location.reload()}
        >
          🔄 Refresh
        </button>
      </div>
    );
  }

  const { name, emoji, age, location, bio, netWorth, spendStyle, badges, redFlags = [], greenFlags = [], image } = currentProfile;
  
  // Format net worth with commas and $ sign
  const formattedNetWorth = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(netWorth);
  
  // Format income
  const formattedIncome = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(currentProfile.income);

  // Calculate total spend (currently not used but keeping for future use)
  // const totalSpend = Object.values(spendStyle).reduce((a, b) => a + b, 0);

  return (
    <div className="swipe-deck">
      <AnimatePresence>
        {showChatbot && currentUser && (
          <Chatbot 
            user={currentUser} 
            onClose={handleCloseChatbot} 
          />
        )}
      </AnimatePresence>
      
      <motion.div
        ref={currentCardRef}
        className={`profile-card ${isAnimating ? 'no-pointer' : ''}`}
        drag={isConnected ? "x" : false}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ x: 0, opacity: 1, rotate: 0 }}
        whileTap={{ scale: isConnected ? 0.98 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="profile-header">
          <div className="profile-image-container">
            <img 
              src={image} 
              alt={name}
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00E7FF&color=0E0E0E&size=200`;
              }}
            />
          </div>
          <div className="net-worth-badge">
            <span>💰</span> {formattedNetWorth}
          </div>
          <h2>{name} {emoji} <span className="age">{age}</span></h2>
          <p className="location">📍 {location}</p>
          <p className="income">💼 {formattedIncome}/year</p>
          
          {/* Quick stats */}
          <div className="quick-stats">
            {redFlags.length > 0 && (
              <span className="stat-tag red">🚩 {redFlags.length} red flags</span>
            )}
            {greenFlags.length > 0 && (
              <span className="stat-tag green">✨ {greenFlags.length} green flags</span>
            )}
          </div>
        </div>
        
        <div className="chat-button-container">
          <button 
            className="chat-button"
            onClick={handleOpenChatbot}
          >
            💬 Chat with {name.split(' ')[0]}
          </button>
        </div>
        
        <div className="spend-style">
          <h3>Spend Style</h3>
          <div className="spend-bars">
            {Object.entries(spendStyle).map(([category, value]) => (
              <div key={category} className="spend-category">
                <div className="category-header">
                  <span className="category-name">{category}</span>
                  <span className="category-percent">{value}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{
                      width: `${value}%`,
                      background: getGradientForCategory(category)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="badges">
          {badges.map((badge, index) => (
            <span 
              key={index} 
              className="badge"
              data-badge={badge}
              title={badge}
            >
              {getBadgeEmoji(badge)} <span className="badge-text">{badge}</span>
            </span>
          ))}
        </div>
        
        <div className="swipe-hint">
          <span className="swipe-left">👈 Swipe left to pass</span>
          <span className="swipe-right">Swipe right to like 👉</span>
        </div>
        
        <div className="chat-button" onClick={handleOpenChatbot}>
          💬 Ask me anything about {name.split(' ')[0]}
        </div>
      </motion.div>
      
      {direction && (
        <div className={`swipe-feedback ${direction}`}>
          {direction === 'right' ? '❤️ Liked!' : '💔 Passed'}
        </div>
      )}
    </div>
  );
};

// Helper functions
const getBadgeEmoji = (badge) => {
  const emojiMap = {
    'Crypto-Cowboy': '🤠',
    'Foodie': '🍔',
    'Early Adopter': '🚀',
    'Travel Bug': '✈️',
    'Coffee Connoisseur': '☕',
    'Side Hustler': '💼',
    'Gamer': '🎮',
    'Tech Enthusiast': '💻',
    'Early Riser': '🌅'
  };
  return emojiMap[badge] || '✨';
};

const getGradientForCategory = (category) => {
  const gradients = {
    essentials: 'linear-gradient(90deg, #00E7FF, #00B8D4)',
    fun: 'linear-gradient(90deg, #FF1F8E, #D500F9)',
    investing: 'linear-gradient(90deg, #C9FF00, #00E676)',
    vice: 'linear-gradient(90deg, #FF9100, #FF1744)'
  };
  return gradients[category] || 'linear-gradient(90deg, #9E9E9E, #616161)';
};

export default SwipeDeck;
