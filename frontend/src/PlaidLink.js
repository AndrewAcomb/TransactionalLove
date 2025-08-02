import React, { useCallback, useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { generateLinkToken, exchangePublicToken, getAllTransactions } from './plaidService';
import { saveTokens, loadTokens, clearTokens } from './tokenStorage';

const TransactionsList = ({ transactions, loading, error }) => {
  if (loading) {
    return (
      <div style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '4px', marginTop: '15px' }}>
        <p style={{ color: '#282c34' }}>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '15px', backgroundColor: '#ffe6e6', borderRadius: '4px', marginTop: '15px' }}>
        <p style={{ color: 'red' }}><strong>Error loading transactions:</strong> {error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div style={{ padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginTop: '15px' }}>
        <p style={{ color: '#282c34' }}>No transactions found.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '15px' }}>
      <h4 style={{ color: '#282c34' }}>Recent Transactions ({transactions.length})</h4>
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
        {transactions.slice(0, 20).map((transaction, index) => (
          <div key={transaction.transaction_id || index} style={{ 
            padding: '10px', 
            borderBottom: index < Math.min(transactions.length, 20) - 1 ? '1px solid #eee' : 'none',
            backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#282c34' }}>{transaction.name || 'Unknown Transaction'}</strong>
                <div style={{ fontSize: '0.9em', color: '#282c34' }}>
                  {transaction.date && ` • ${transaction.date}`}
                </div>
              </div>
              <div style={{ 
                fontWeight: 'bold', 
                color: transaction.amount > 0 ? '#d32f2f' : '#388e3c',
                textAlign: 'right'
              }}>
                {transaction.amount > 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                <div style={{ fontSize: '0.8em', color: '#282c34' }}>
                  {transaction.iso_currency_code || 'USD'}
                </div>
              </div>
            </div>
          </div>
        ))}
        {transactions.length > 20 && (
          <div style={{ padding: '10px', textAlign: 'center', fontStyle: 'italic', color: '#eee' }}>
            Showing first 20 of {transactions.length} transactions
          </div>
        )}
      </div>
    </div>
  );
};

const PlaidLink = () => {
  const [account, setAccount] = useState(null);
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingTokens, setExistingTokens] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionError, setTransactionError] = useState(null);

  const fetchTransactions = useCallback(async (accessToken) => {
    try {
      setLoadingTransactions(true);
      setTransactionError(null);
      
      const fetchedTransactions = await getAllTransactions(accessToken);
      setTransactions(fetchedTransactions);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setTransactionError(err.message);
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setLoading(true);
        
        const tokens = await loadTokens();
        if (tokens && tokens.access_token && tokens.item_id) {
          setExistingTokens(tokens);
          setLoading(false);
          fetchTransactions(tokens.access_token);
          return;
        }
        
        const token = await generateLinkToken();
        setLinkToken(token);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to initialize:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();
  }, [fetchTransactions]);

  const onSuccess = useCallback(async (public_token, metadata) => {
    console.log('Link successful!', { public_token, metadata });
    
    try {
      const { access_token, item_id } = await exchangePublicToken(public_token);
      await saveTokens(access_token, item_id);
      
      setAccount({
        publicToken: public_token,
        accessToken: access_token,
        itemId: item_id,
        accounts: metadata.accounts,
        institution: metadata.institution,
        linkSessionId: metadata.link_session_id
      });

      fetchTransactions(access_token);
    } catch (err) {
      console.error('Failed to exchange token:', err);
      setError('Failed to complete account linking');
    }
  }, [fetchTransactions]);

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

  const handleClearTokens = async () => {
    await clearTokens();
    setExistingTokens(null);
    setAccount(null);
    setTransactions([]);
    setTransactionError(null);
    window.location.reload();
  };

  if (existingTokens) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Plaid Link Integration</h2>
        <div style={{ padding: '15px', borderRadius: '4px', border: '1px solid #4CAF50' }}>
          <h3>✓ Bank Account Already Connected</h3>
          <p><strong>Item ID:</strong> {existingTokens.item_id}</p>
          <p><strong>Access Token:</strong> {existingTokens.access_token.substring(0, 20)}...</p>
          <p><strong>Connected:</strong> {new Date(existingTokens.timestamp).toLocaleString()}</p>
          
          <button 
            onClick={handleClearTokens}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Disconnect & Reset
          </button>
        </div>
        
        <TransactionsList 
          transactions={transactions} 
          loading={loadingTransactions} 
          error={transactionError} 
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Plaid Link Integration</h2>
      
      {loading ? (
        <div>
          <p>Checking existing connection...</p>
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
          <div style={{ backgroundColor: '#2196F3', padding: '15px', borderRadius: '4px' }}>
            <p><strong>Institution:</strong> {account.institution.name}</p>
            <p><strong>Item ID:</strong> {account.itemId}</p>
            <p><strong>Access Token:</strong> {account.accessToken.substring(0, 20)}...</p>
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
            onClick={handleClearTokens}
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
            Disconnect & Reset
          </button>
          
          <TransactionsList 
            transactions={transactions} 
            loading={loadingTransactions} 
            error={transactionError} 
          />
        </div>
      )}
    </div>
  );
};

export default PlaidLink;