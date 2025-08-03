// Mock data for user profiles and transactions
export const mockUsers = [
  {
    id: 'user_1',
    name: 'Alex',
    emoji: '👾',
    age: 22,
    image: 'https://i.pravatar.cc/300?img=1',
    location: 'Miami, FL',
    netWorth: 42069,
    income: 85000,
    riskScore: 0.92,
    spendStyle: {
      essentials: 30,
      fun: 50,
      investing: 5,
      vice: 15
    },
    badges: ['Partyboi', 'Degen Maxi', 'Sneakerhead', 'Gym Rat', 'Crypto Bro', 'SBF Stan'],
    lastActive: '2h ago',
    vibe: 'spends too much on sneakers and crypto',
    redFlags: ['$5k on OnlyFans last month', '3 gym memberships but never goes']
  },
  {
    id: 'user_2',
    name: 'Jordan',
    emoji: '✨',
    age: 24,
    image: 'https://i.pravatar.cc/300?img=2',
    location: 'Austin, TX',
    netWorth: 125000,
    income: 185000,
    riskScore: 0.75,
    spendStyle: {
      essentials: 25,
      fun: 40,
      investing: 30,
      vice: 5
    },
    badges: ['Girlboss', 'Soho House', 'Angel Investor', 'SaaS Queen', 'SBF Hater', 'Soho House'],
    lastActive: '5m ago',
    vibe: 'has 17 side hustles and a 750 credit score',
    greenFlags: ['$0 in student loans', 'maxed out 401k match']
  },
  {
    id: 'user_3',
    name: 'Taylor',
    emoji: '🎮',
    age: 21,
    image: 'https://i.pravatar.cc/300?img=3',
    location: 'Portland, OR',
    netWorth: 3500,
    income: 45000,
    riskScore: 0.45,
    spendStyle: {
      essentials: 60,
      fun: 25,
      investing: 5,
      vice: 10
    },
    badges: ['Gamer', 'Discord Mod', 'Ramen Budget', 'Shiba Inu Holder', 'SBF Apologist', 'DeFi Degenerate'],
    lastActive: '1h ago',
    vibe: 'spends rent money on Genshin Impact',
    redFlags: ['-$200 in checking', '12 active Afterpay loans']
  },
  {
    id: 'user_4',
    name: 'Riley',
    emoji: '👑',
    age: 26,
    image: 'https://i.pravatar.cc/300?img=4',
    location: 'New York, NY',
    netWorth: 250000,
    income: 320000,
    riskScore: 0.85,
    spendStyle: {
      essentials: 20,
      fun: 30,
      investing: 45,
      vice: 5
    },
    badges: ['Soho House', 'SBF', 'VC Darling', 'Soho House', 'Soho House', 'Soho House'],
    lastActive: 'just now',
    vibe: 'has never seen a budget in their life',
    greenFlags: ['family owns an island', 'private jet flex']
  }
];

export const mockTransactions = [
  // User 1 transactions (Alex - Crypto degen)
  { userId: 'user_1', amount: 250.00, merchant: 'StockX', category: 'Shopping', vibeTag: 'sneakers' },
  { userId: 'user_1', amount: 500.00, merchant: 'Binance', category: 'Investments', vibeTag: 'crypto' },
  { userId: 'user_1', amount: 99.99, merchant: 'GymShark', category: 'Shopping', vibeTag: 'gym' },
  { userId: 'user_1', amount: 5.99, merchant: 'OnlyFans', category: 'Entertainment', vibeTag: 'vice' },
  { userId: 'user_1', amount: 75.50, merchant: 'SneakerCon', category: 'Entertainment', vibeTag: 'sneakers' },
  
  // User 2 transactions (Jordan - Hustler)
  { userId: 'user_2', amount: 8.75, merchant: 'Starbucks', category: 'Food & Drink', vibeTag: 'coffee' },
  { userId: 'user_2', amount: 150.00, merchant: 'Etsy Shop', category: 'Income', vibeTag: 'side_hustle' },
  { userId: 'user_2', amount: 300.00, merchant: 'Robinhood', category: 'Investments', vibeTag: 'stocks' },
  { userId: 'user_2', amount: 29.99, merchant: 'Skillshare', category: 'Education', vibeTag: 'self_improvement' },
  
  // User 3 transactions (Taylor - Gamer)
  { userId: 'user_3', amount: 79.99, merchant: 'Steam', category: 'Entertainment', vibeTag: 'gaming' },
  { userId: 'user_3', amount: 12.99, merchant: 'OnlyFans', category: 'Entertainment', vibeTag: 'vice' },
  { userId: 'user_3', amount: 4.20, merchant: '7-Eleven', category: 'Food & Drink', vibeTag: 'snacks' },
  { userId: 'user_3', amount: 29.99, merchant: 'Discord Nitro', category: 'Subscriptions', vibeTag: 'gaming' },
  
  // User 4 transactions (Riley - Rich kid)
  { userId: 'user_4', amount: 1200.00, merchant: 'Nobu', category: 'Dining', vibeTag: 'luxury' },
  { userId: 'user_4', amount: 5000.00, merchant: 'Gucci', category: 'Shopping', vibeTag: 'designer' },
  { userId: 'user_4', amount: 25000.00, merchant: 'Bitcoin', category: 'Investments', vibeTag: 'crypto' },
  { userId: 'user_4', amount: 1500.00, merchant: 'Equinox', category: 'Health', vibeTag: 'gym' }
];

// Gen Z / Alpha slang responses
const genZResponses = {
  // Greetings
  'hi': 'heyyy bestieee 👋',
  'hello': 'hiiii slay',
  'hey': 'heyyy',
  
  // Vibes
  'vibe': (user) => `${user.name} is ${user.vibe} ${user.emoji} ${user.vibe.includes('spends rent') ? '💀' : '✨'}`,
  'vibes': (user) => genZResponses['vibe'](user),
  'how are they': (user) => genZResponses['vibe'](user),
  
  // Financial status
  'broke': (user) => user.netWorth < 10000 ? 'lmao theyre BROKE broke' : 'nah theyre good actually',
  'rich': (user) => user.netWorth > 200000 ? 'omg yes trust fund babyyy' : 'not rich rich but theyre doing ok',
  'net worth': (user) => `their net worth is ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(user.netWorth)} ${user.netWorth > 100000 ? '😏' : '😬'}`,
  
  // Badge explanations
  'what does [\w\s]+ mean' /* eslint-disable-line no-useless-escape */: (user, match) => {
    const badgeName = match[0].toLowerCase();
    const badge = user.badges.find(b => b.toLowerCase().includes(badgeName));
    if (!badge) return 'idk that badge bestie';
    
    const badgeExplanations = {
      'rizz god': 'has insane rizz, probably a fboi',
      'gyatt in the chat': 'has a dump truck',
      'sigma grindset': 'wakes up at 4am to grind',
      'nft maxi': 'lost all their money on jpegs',
      'girl math pro': 'justifies all purchases',
      'ceo of gaslighting': 'manipulative king/queen',
      'soft life enthusiast': 'no 9-5, just vibes',
      'babygirl finance': 'terrible with money but makes it cute',
      'broke baddie': 'broke but still slays',
      'trauma dump champion': 'overshares on first date',
      'nepo baby': 'daddys money',
      'trust fund kid': 'never worked a day in their life',
      'private jet setter': 'flies private only'
    };
    
    return badgeExplanations[badge.toLowerCase()] || 'idk ask someone else';
  },
  
  // Red flags
  'red flag': (user) => {
    if (!user.redFlags || user.redFlags.length === 0) return 'no red flags that i can see tbh';
    return `🚩 ${user.redFlags[Math.floor(Math.random() * user.redFlags.length)]} 🚩`;
  },
  
  // Green flags
  'green flag': (user) => {
    if (!user.greenFlags || user.greenFlags.length === 0) return 'idk theyre kinda basic';
    return `✨ ${user.greenFlags[Math.floor(Math.random() * user.greenFlags.length)]} ✨`;
  },
  
  // Dating red flags
  'date': (user) => {
    if (user.redFlags && user.redFlags.some(f => f.includes('OnlyFans'))) {
      return 'lmao they spend more on OnlyFans than rent, RUN';
    }
    if (user.netWorth < 0) {
      return 'broke and in debt, but at least theyre cute?';
    }
    if (user.netWorth > 200000) {
      return 'omg yes marry them immediately';
    }
    return 'meh, theyre ok i guess';
  },
  
  // Default response if no matches
  'default': `idk what ur saying bestie, try again ${['🤷', '💅', '✨', '🤔', '🧚', '🤙'][Math.floor(Math.random() * 6)]}`
};

export const getMockPlaidData = (userId) => {
  const user = mockUsers.find(u => u.id === userId);
  const userTransactions = mockTransactions.filter(t => t.userId === userId);
  
  // Calculate spend by category for the chatbot
  const spendByCategory = userTransactions.reduce((acc, t) => {
    acc[t.vibeTag] = (acc[t.vibeTag] || 0) + t.amount;
    return acc;
  }, {});
  
  // Add some fun facts to the user object for the chatbot
  user.spendByCategory = spendByCategory;
  user.biggestVice = Object.entries(spendByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'nothing sus';
  
  return {
    accounts: [
      {
        account_id: 'vzeNDwK7KQIm4yEog683uElbp9KRLEFXGK98D',
        balances: {
          available: user.netWorth * 0.7,
          current: user.netWorth,
          limit: null
        },
        mask: '0000',
        name: 'Plaid Checking',
        official_name: 'Plaid Gold Standard 0% Interest Checking',
        subtype: 'checking',
        type: 'depository'
      }
    ],
    item: {},
    request_id: '45QSn',
    transactions: userTransactions.map(t => ({
      account_id: 'vzeNDwK7KQIm4yEog683uElbp9KRLEFXGK98D',
      amount: t.amount,
      category: [t.category],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      merchant_name: t.merchant,
      name: t.merchant,
      payment_meta: {},
      pending: false,
      transaction_id: `mock_${Math.random().toString(36).substr(2, 9)}`,
      transaction_type: 'place',
      vibe_tag: t.vibeTag,
      category_icon: getCategoryIcon(t.vibeTag)
    })),
    user: user
  };
};

// Helper function to get category icons for transactions
function getCategoryIcon(category) {
  const icons = {
    'sneakers': '👟',
    'crypto': '🪙',
    'gym': '💪',
    'vice': '🍷',
    'coffee': '☕',
    'side_hustle': '💼',
    'stocks': '📈',
    'self_improvement': '📚',
    'gaming': '🎮',
    'snacks': '🍿',
    'luxury': '💎',
    'designer': '👔',
    'travel': '✈️',
    'dating_app': '💘',
    'subscription': '🔄',
    'tech': '💻'
  };
  return icons[category] || '💸';
}

// Function to process chatbot messages
export const processChatMessage = (message, user) => {
  if (!message || typeof message !== 'string') return genZResponses['default'];
  
  const lowerMessage = message.toLowerCase().trim();
  
  // Check for specific patterns
  for (const [pattern, response] of Object.entries(genZResponses)) {
    if (pattern === 'default') continue;
    
    // Handle regex patterns
    if (pattern.startsWith('what does [\\w\\s]+ mean')) {
      const match = lowerMessage.match(/what does (\w+) mean/);
      if (match) {
        return typeof response === 'function' ? response(user, match[1]) : response;
      }
    }
    // Handle simple string matches
    else if (lowerMessage.includes(pattern)) {
      return typeof response === 'function' ? response(user) : response;
    }
  }
  
  // Check for transaction-related questions
  if (lowerMessage.includes('spend') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
    if (lowerMessage.includes('most') || lowerMessage.includes('biggest')) {
      const biggestSpend = Math.max(...Object.values(user.spendByCategory || {}));
      const category = Object.entries(user.spendByCategory || {}).find(([_, v]) => v === biggestSpend)?.[0];
      return category ? `they spend the most on ${category} ($${biggestSpend.toFixed(2)}) ${'💸'.repeat(3)}` : 'idk';
    }
  }
  
  // Check for vibe check
  if (lowerMessage.includes('vibe check') || lowerMessage.includes('vibes')) {
    return genZResponses['vibe'](user);
  }
  
  // Check for gooner (someone who spends on OnlyFans)
  if (lowerMessage.includes('gooner') || lowerMessage.includes('simp')) {
    const ofSpend = user.spendByCategory?.vice || 0;
    if (ofSpend > 100) return `lmao BIG TIME GOONER ALERT 🚨 they spent $${ofSpend} on OF last month`;
    if (ofSpend > 0) return `they spent $${ofSpend} on OF but whos counting`;
    return 'nah theyre clean';
  }
  
  // Default response
  return genZResponses['default'];
};
