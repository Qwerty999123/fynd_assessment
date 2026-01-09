import React from 'react';
import { CheckCircle, XCircle, Sparkles } from 'lucide-react';

const ResponseDisplay = ({ type, message, onClose }) => {
  const configs = {
    success: {
      icon: CheckCircle,
      title: 'Thank you for your feedback!',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    error: {
      icon: XCircle,
      title: 'Oops! Something went wrong',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    },
  };

  const config = configs[type] || configs.success;
  const Icon = config.icon;

  return (
    <div className="response-card">
      <div className="response-content">
        <div className="response-icon" style={{ background: config.gradient }}>
          <Icon size={48} />
        </div>
        <div className="response-text">
          <h2 className={`response-title ${type}`}>
            {config.title}
          </h2>
          <div className="response-message">
            {type === 'success' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                <Sparkles size={24} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.25rem' }} />
                <div>
                  <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>
                    AI Response:
                  </strong>
                  <p style={{ margin: 0 }}>{message}</p>
                </div>
              </div>
            )}
            {type === 'error' && <p>{message}</p>}
          </div>
          {onClose && (
            <button onClick={onClose} className="response-button">
              Submit Another Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponseDisplay;