import React from 'react';
import { 
  Star, 
  Clock, 
  MessageSquare, 
  Lightbulb, 
  CheckCircle,
  FileText 
} from 'lucide-react';

const SubmissionCard = ({ submission, index }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Just now';
    }
  };

  // Safe access to ID - handle both 'id' and '_id' fields
  const getId = () => {
    const id = submission.id || submission._id || 'unknown';
    if (typeof id === 'string' && id.length > 8) {
      return id.slice(-8);
    }
    return id;
  };

  // Safety checks for required fields
  if (!submission) {
    return null;
  }

  return (
    <div 
      className="submission-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Header */}
      <div className="submission-card-header">
        <div className="submission-meta">
          <div className="submission-id">
            ID: {getId()}
          </div>
          <div className="submission-time">
            <Clock size={16} />
            {formatDate(submission.timestamp)}
          </div>
        </div>
        <div className={`rating-badge star-${submission.rating || 3}`}>
          <Star size={20} fill="white" />
          {submission.rating || 0} Star{submission.rating !== 1 ? 's' : ''}
        </div>
      </div>

      {/* User Review */}
      <div className="submission-section">
        <div className="section-title">
          <MessageSquare size={18} />
          Customer Review
        </div>
        <div className="section-content">
          {submission.review_text || 'No review text provided'}
        </div>
      </div>

      {/* AI Summary */}
      <div className="submission-section">
        <div className="section-title">
          <FileText size={18} />
          AI Summary
        </div>
        <div className="section-content">
          {submission.ai_summary || 'Summary not available'}
        </div>
      </div>

      {/* Suggested Actions */}
      <div className="submission-section">
        <div className="section-title">
          <Lightbulb size={18} />
          Suggested Actions
        </div>
        <ul className="actions-list">
          {(submission.suggested_actions || []).map((action, idx) => (
            <li key={idx} className="action-item">
              <CheckCircle size={18} />
              {action}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubmissionCard;