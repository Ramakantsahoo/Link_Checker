// pages/index.js
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const checkLinks = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/check-links', { link: url });
      setResults(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error checking links:', error);
      setResults([]);
      setErrorMessage('An error occurred while checking links. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>Broken Link Checker</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: '70%', padding: '8px', marginRight: '10px', textAlign: 'center' }}
        />
        <button onClick={checkLinks} className="cool-button">
          Check Links
        </button>
      </div>
      {loading && <p style={{ textAlign: 'center' }}>Checking links...</p>}
      <div className="results-container">
        {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
        {results.map((link, index) => (
          <p key={index} style={{ color: link.valid ? 'green' : 'red', textAlign: 'center' }}>
            {link.url} - {link.valid ? 'Not a broken link' : 'Broken link'}
          </p>
        ))}
      </div>
    </div>
  );
}
