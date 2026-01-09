import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds for LLM response
});

// Submit a review
export const submitReview = async (rating, reviewText) => {
  try {
    const response = await api.post('/api/reviews/submit', {
      rating,
      review_text: reviewText,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.detail || 'Failed to submit review');
    } else if (error.request) {
      // No response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Request setup error
      throw new Error('Failed to submit review. Please try again.');
    }
  }
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/api/reviews/health');
    return response.data;
  } catch (error) {
    throw new Error('API is not reachable');
  }
};

export default api;