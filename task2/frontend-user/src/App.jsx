import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import ReviewForm from './components/ReviewForm';
import ResponseDisplay from './components/ResponseDisplay';
import { submitReview, checkHealth } from './services/api';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [response, setResponse] = useState(null);

  useEffect(() => {
    // Check API health on mount
    checkHealth()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  const handleSubmitSuccess = async (rating, reviewText) => {
    try {
      const result = await submitReview(rating, reviewText);
      setResponse({
        type: 'success',
        message: result.ai_response,
      });
      // Auto-scroll to response
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      throw error;
    }
  };

  const handleSubmitError = (error) => {
    setResponse({
      type: 'error',
      message: error.message,
    });
  };

  const handleCloseResponse = () => {
    setResponse(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <header className="header">
          <div className="header-icon">
            <MessageSquare size={48} />
          </div>
          <h1>Customer Feedback</h1>
          <p className="header-subtitle">
            We value your opinion! Share your experience with us.
          </p>
        </header>

        {/* API Status Banner */}
        {apiStatus === 'offline' && (
          <div className="status-banner error">
            <AlertCircle size={20} />
            Unable to connect to server. Please check your connection.
          </div>
        )}
        {apiStatus === 'checking' && (
          <div className="status-banner info">
            <Loader2 size={20} className="animate-spin" />
            Connecting to server...
          </div>
        )}

        {/* Main Content */}
        {!response ? (
          <div className="main-card">
            <div className="card-header">
              <h2 className="card-title">How was your experience?</h2>
              <p className="card-subtitle">
                Your feedback helps us improve our service
              </p>
            </div>
            <ReviewForm
              onSubmitSuccess={handleSubmitSuccess}
              onSubmitError={handleSubmitError}
            />
          </div>
        ) : (
          <ResponseDisplay
            type={response.type}
            message={response.message}
            onClose={handleCloseResponse}
          />
        )}

        {/* Footer */}
        <footer className="footer">
          <p>
            © 2026 Review Feedback System • Powered by AI
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;