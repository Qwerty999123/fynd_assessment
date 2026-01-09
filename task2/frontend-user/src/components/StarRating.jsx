import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onRatingChange, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!disabled) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!disabled) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="star-rating-container">
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hoverRating || rating);
          
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              disabled={disabled}
              className="star-button"
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            >
              <Star
                size={56}
                className={isFilled ? '' : ''}
                style={{
                  fill: isFilled ? '#fbbf24' : 'none',
                  color: isFilled ? '#fbbf24' : '#d1d5db',
                  transition: 'all 0.2s ease',
                }}
              />
            </button>
          );
        })}
      </div>
      <div className="rating-text">
        {rating > 0 ? `${rating} Star${rating !== 1 ? 's' : ''}` : 'Select Rating'}
      </div>
    </div>
  );
};

export default StarRating;