const TOKEN_FILE_PATH = '/Users/andrewacomb/hobbies/hackathons/TransactionalLove/frontend/plaid-tokens.json';

export const saveTokens = async (access_token, item_id) => {
  const tokenData = {
    access_token,
    item_id,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch('http://localhost:3001/save-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenData)
    });

    if (!response.ok) {
      throw new Error('Failed to save tokens');
    }

    console.log('Tokens saved successfully');
  } catch (error) {
    console.log('File API not available, saving to localStorage instead');
    localStorage.setItem('plaid_tokens', JSON.stringify(tokenData));
  }
};

export const loadTokens = async () => {
  try {
    const response = await fetch('http://localhost:3001/load-tokens');
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log('File API not available, checking localStorage');
  }

  const stored = localStorage.getItem('plaid_tokens');
  return stored ? JSON.parse(stored) : null;
};

export const clearTokens = async () => {
  try {
    await fetch('http://localhost:3001/clear-tokens', { method: 'DELETE' });
  } catch (error) {
    console.log('File API not available, clearing localStorage');
  }
  
  localStorage.removeItem('plaid_tokens');
};