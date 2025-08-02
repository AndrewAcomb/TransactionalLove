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
        products: ['transactions'],
        transactions: {
          days_requested: 730
        }
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

export const exchangePublicToken = async (public_token) => {
  const clientId = process.env.REACT_APP_PLAID_CLIENT_ID;
  const secret = process.env.REACT_APP_PLAID_SECRET;
  const env = process.env.REACT_APP_PLAID_ENV || 'sandbox';
  
  const baseUrl = PLAID_ENV_MAP[env];
  
  try {
    const response = await fetch(`${baseUrl}/item/public_token/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        secret: secret,
        public_token: public_token
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Plaid API error: ${errorData.error_message || response.statusText}`);
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      item_id: data.item_id
    };
  } catch (error) {
    console.error('Error exchanging public token:', error);
    throw error;
  }
};

export const syncTransactions = async (access_token, cursor = null) => {
  const clientId = process.env.REACT_APP_PLAID_CLIENT_ID;
  const secret = process.env.REACT_APP_PLAID_SECRET;
  const env = process.env.REACT_APP_PLAID_ENV || 'sandbox';
  
  const baseUrl = PLAID_ENV_MAP[env];
  
  try {
    const requestBody = {
      client_id: clientId,
      secret: secret,
      access_token: access_token
    };

    if (cursor) {
      requestBody.cursor = cursor;
    }

    const response = await fetch(`${baseUrl}/transactions/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Plaid API error: ${errorData.error_message || response.statusText}`);
    }

    const data = await response.json();
    return {
      added: data.added || [],
      modified: data.modified || [],
      removed: data.removed || [],
      next_cursor: data.next_cursor,
      has_more: data.has_more
    };
  } catch (error) {
    console.error('Error syncing transactions:', error);
    throw error;
  }
};

export const getAllTransactions = async (access_token) => {
  let allTransactions = [];
  let cursor = null;
  let hasMore = true;

  try {
    while (hasMore) {
      const result = await syncTransactions(access_token, cursor);
      
      console.log(`Fetched ${result.added.length} transactions in this batch. Total so far: ${allTransactions.length}`);
      
      allTransactions = allTransactions.concat(result.added);
      
      cursor = result.next_cursor;
      hasMore = result.has_more;
      
      console.log(`After adding batch: ${allTransactions.length} total transactions. Has more: ${hasMore}`);
    }

    console.log(`Final transaction count: ${allTransactions.length}`);
    return allTransactions;
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    throw error;
  }
};