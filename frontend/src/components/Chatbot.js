import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Chatbot.css';

// Function to generate Claude prompt based on user profile
const generateClaudePrompt = (user, message) => {
  return `You are roleplaying as ${user.name}, a ${user.age}-year-old from ${user.location}. 
  Your personality: ${user.bio}
  Financial vibe: ${user.vibe}
  Net worth: ${user.netWorth}
  Income: ${user.income}/year
  Spend style: ${JSON.stringify(user.spendStyle)}
  Badges: ${user.badges.join(', ')}
  
  Respond to the following message in a GEN Z/ALPHA style with lots of emojis and internet slang. 
  Keep it short, casual, and funny. Don't be afraid to be sassy or dramatic. 
  Use modern internet slang and abbreviations (frfr, no cap, bussin, etc).
  
  Message: "${message}"`;
};

// Function to call Claude API
const callClaudeAPI = async (prompt) => {
  console.log('Sending prompt to Claude:', prompt);
  
  // Fallback function for when Claude API fails
  const getFallbackResponse = () => {
    const fallbacks = [
      'omg sry bestie my wifi is being a whole mess rn 😩💀',
      'brb my phone died frfr 🔋⚰️',
      'no cap i would answer but my brain cells took a vacay ✈️🧠',
      'error 404: could not compute rizz 🤖💔',
      'me rn: 🤡🌍 (clown world)'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  // Check if API key is set
  if (!process.env.REACT_APP_CLAUDE_API_KEY || process.env.REACT_APP_CLAUDE_API_KEY === 'your_actual_api_key_here') {
    console.error('Claude API key not configured');
    return getFallbackResponse();
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 150,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Claude API error:', response.status, errorData);
      return getFallbackResponse();
    }
    
    const data = await response.json();
    console.log('Claude API response:', data);
    
    if (data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text;
    } else {
      console.error('Unexpected response format from Claude API:', data);
      return getFallbackResponse();
    }
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return getFallbackResponse();
  }
};

const Chatbot = ({ user, onClose }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: `heyyy bestieee! ask me anything about ${user.name} ${user.emoji}`, 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Add typing indicator
    const typingIndicator = {
      id: 'typing',
      text: '...',
      sender: 'bot',
      isTyping: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, typingIndicator]);

    try {
      // Generate prompt for Claude
      const prompt = generateClaudePrompt(user, inputValue);
      
      // Call Claude API
      const botResponse = await callClaudeAPI(prompt);
      
      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [
          ...filtered,
          {
            id: filtered.length + 1,
            text: botResponse,
            sender: 'bot',
            timestamp: new Date()
          }
        ];
      });
    } catch (error) {
      console.error('Error in chatbot:', error);
      // Fallback to mock response if API fails
      const fallbackResponses = [
        'omg sry bestie my brain stopped working for a sec 😅',
        'no cap idk what to say to that frfr 🤷‍♀️',
        'error 404: rizz not found 💀',
        'me rn: 🤔💭❓',
        'brb consulting the council of gen z elders 👵🧓👴'
      ];
      
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        return [
          ...filtered,
          {
            id: filtered.length + 1,
            text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
            sender: 'bot',
            timestamp: new Date()
          }
        ];
      });
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      className="chatbot-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="chatbot-header">
        <div className="chatbot-title">
          <span className="chatbot-emoji">💭</span>
          <h3>vibe check with {user.name} {user.emoji}</h3>
        </div>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="chatbot-messages">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`message ${message.sender}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="message-content">
                {message.text}
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      <form onSubmit={handleSendMessage} className="chatbot-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`ask me about ${user.name.split(' ')[0]}...`}
          className="chatbot-input"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!inputValue.trim()}
        >
          send
        </button>
      </form>
    </motion.div>
  );
};

export default Chatbot;
