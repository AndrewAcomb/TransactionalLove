import React, { useCallback, useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { generateLinkToken } from './plaidService';

const PlaidLink = () => {
  const [account, setAccount] = useState(null);
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        setLoading(true);
        const token = await generateLinkToken();
        setLinkToken(token);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to generate link token:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinkToken();
  }, []);

  const onSuccess = useCallback((public_token, metadata) => {
    console.log('Link successful!', { public_token, metadata });
    setAccount({
      publicToken: public_token,
      accounts: metadata.accounts,
      institution: metadata.institution,
      linkSessionId: metadata.link_session_id
    });
  }, []);

  const onExit = useCallback((err, metadata) => {
    console.log('Link exited', { err, metadata });
  }, []);

  const config = {
    token: linkToken,
    onSuccess,
    onExit,
  };

  const { open, ready } = usePlaidLink(config);

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Plaid Link Integration</h2>
        <div style={{ color: 'red', padding: '15px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
          <p><strong>Error:</strong> {error}</p>
          <p>Make sure your Plaid credentials are set in the .env file</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Plaid Link Integration</h2>
      
      {loading ? (
        <div>
          <p>Generating link token...</p>
        </div>
      ) : !account ? (
        <div>
          <p>Click the button below to link your bank account with Plaid:</p>
          <button 
            onClick={() => open()} 
            disabled={!ready || !linkToken}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (ready && linkToken) ? 'pointer' : 'not-allowed',
              opacity: (ready && linkToken) ? 1 : 0.6
            }}
          >
            {ready && linkToken ? 'Connect Bank Account' : 'Loading...'}
          </button>
        </div>
      ) : (
        <div>
          <h3>Account Connected Successfully!</h3>
          <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px' }}>
            <p><strong>Institution:</strong> {account.institution.name}</p>
            <p><strong>Public Token:</strong> {account.publicToken}</p>
            <p><strong>Accounts:</strong> {account.accounts.length}</p>
            <ul>
              {account.accounts.map((acc, index) => (
                <li key={index}>
                  {acc.name} - {acc.subtype} ({acc.mask})
                </li>
              ))}
            </ul>
          </div>
          <button 
            onClick={() => setAccount(null)}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset Connection
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaidLink;