import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Get all reviews
export const getAllReviews = async (limit = 50, skip = 0, rating = null) => {
  try {
    const params = { limit, skip };
    if (rating) params.rating = rating;
    
    const response = await api.get('/api/reviews/all', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error(
      error.response?.data?.detail || 'Failed to fetch reviews'
    );
  }
};

// Get statistics
export const getStats = async () => {
  try {
    const response = await api.get('/api/reviews/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw new Error(
      error.response?.data?.detail || 'Failed to fetch statistics'
    );
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