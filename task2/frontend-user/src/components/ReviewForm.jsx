import React, { useState } from 'react';
import { Send, Loader2, Star as StarIcon, MessageSquare } from 'lucide-react';
import StarRating from './StarRating';

const ReviewForm = ({ onSubmitSuccess, onSubmitError }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!reviewText.trim()) {
      newErrors.reviewText = 'Please write a review';
    } else if (reviewText.trim().length < 10) {
      newErrors.reviewText = 'Review must be at least 10 characters';
    } else if (reviewText.length > 5000) {
      newErrors.reviewText = 'Review must not exceed 5000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmitSuccess(rating, reviewText);
      // Reset form on success
      setRating(0);
      setReviewText('');
    } catch (error) {
      onSubmitError(error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (errors.rating) {
      setErrors({ ...errors, rating: undefined });
    }
  };

  const handleTextChange = (e) => {
    setReviewText(e.target.value);
    if (errors.reviewText) {
      setErrors({ ...errors, reviewText: undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      {/* Rating Section */}
      <div className="form-section">
        <label className="form-label">
          <StarIcon size={24} />
          How would you rate your experience?
        </label>
        <StarRating
          rating={rating}
          onRatingChange={handleRatingChange}
          disabled={isSubmitting}
        />
        {errors.rating && (
          <div className="error-message">{errors.rating}</div>
        )}
      </div>

      {/* Review Text Section */}
      <div className="form-section">
        <label htmlFor="review-text" className="form-label">
          <MessageSquare size={24} />
          Share your experience
        </label>
        <textarea
          id="review-text"
          value={reviewText}
          onChange={handleTextChange}
          disabled={isSubmitting}
          placeholder="Tell us about your experience... What did you like? What could be improved?"
          className={`review-textarea ${errors.reviewText ? 'error' : ''}`}
        />
        <div className="textarea-footer">
          <div>
            {errors.reviewText && (
              <div className="error-message">{errors.reviewText}</div>
            )}
          </div>
          <div className="char-count">
            {reviewText.length} / 5000 characters
          </div>
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="status-banner error">
          {errors.submit}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={28} />
            <span>Processing your review...</span>
          </>
        ) : (
          <>
            <Send size={24} />
            <span>Submit Review</span>
          </>
        )}
      </button>
    </form>
  );
};

export default ReviewForm;