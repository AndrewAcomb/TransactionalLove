const PLAID_ENV_MAP = {
  sandbox: 'https://sandbox.plaid.com',
  development: 'https://development.plaid.com',
  production: 'https://production.plaid.com'
};

export const generateLinkToken = async () => {
  const clientId = process.env.REACT_APP_PLAID_CLIENT_ID;
  const secret = process.env.REACT_APP_PLAID_SECRET;
  const env = process.env.REACT_APP_PLAID_ENV || 'sandbox';
  
  if (!clientId || !secret) {
    throw new Error('Missing Plaid credentials in environment variables');
  }

  const baseUrl = PLAID_ENV_MAP[env];
  
  try {
    const response = await fetch(`${baseUrl}/link/token/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        secret: secret,
        client_name: 'Transactional Love',
        country_codes: ['US'],
        language: 'en',
        user: {
          client_user_id: 'unique_user_id_' + Date.now()
        },
        products: ['transactions']
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Plaid API error: ${errorData.error_message || response.statusText}`);
    }

    const data = await response.json();
    return data.link_token;
  } catch (error) {
    console.error('Error generating link token:', error);
    throw error;
  }
};