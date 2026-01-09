import React, { useState, useEffect } from 'react';
import { LayoutDashboard, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import SubmissionCard from './components/SubmissionCard';
import EmptyState from './components/EmptyState';
import { getAllReviews, getStats, checkHealth } from './services/api';
import './App.css';

function App() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  // Check API health on mount
  useEffect(() => {
    checkHealth()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  // Fetch data
  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    
    setError(null);

    try {
      const [reviewsData, statsData] = await Promise.all([
        getAllReviews(50, 0, selectedRating),
        getStats(),
      ]);

      setReviews(reviewsData.reviews);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, [selectedRating]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedRating]);

  const handleRefresh = () => {
    fetchData(true);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  const handleResetFilters = () => {
    setSelectedRating(null);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div>
              <div className="header-title">
                <LayoutDashboard size={40} />
                <h1>Admin Dashboard</h1>
              </div>
              <p className="header-subtitle">
                Monitor and manage customer feedback
              </p>
            </div>
            <div className="header-actions">
              <button
                className="btn btn-primary"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw 
                  size={20} 
                  className={refreshing ? 'animate-spin' : ''} 
                />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </header>

        {/* API Status Banner */}
        {apiStatus === 'offline' && (
          <div className="status-banner error">
            <AlertCircle size={20} />
            Unable to connect to server. Please check if the backend is running.
          </div>
        )}
        {apiStatus === 'checking' && (
          <div className="status-banner info">
            <Loader2 size={20} className="animate-spin" />
            Connecting to server...
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards stats={stats || {}} loading={loading && !stats} />

        {/* Filter Bar */}
        <FilterBar
          selectedRating={selectedRating}
          onRatingChange={handleRatingChange}
          onReset={handleResetFilters}
        />

        {/* Submissions */}
        <div className="submissions-container">
          <div className="submissions-header">
            <h2 className="submissions-title">
              {selectedRating 
                ? `${selectedRating}-Star Reviews` 
                : 'All Reviews'}
            </h2>
            {reviews.length > 0 && (
              <div className="submissions-count">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </div>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="status-banner error" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && !refreshing && (
            <div className="loading-spinner">
              <Loader2 size={48} className="animate-spin" />
            </div>
          )}

          {/* Reviews List */}
          {!loading && reviews.length > 0 && (
            <div className="submissions-grid">
              {reviews.map((review, index) => (
                <SubmissionCard
                  key={review._id || review.id || `review-${index}`}  // ADD THIS LINE
                  submission={review}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && reviews.length === 0 && !error && (
            <EmptyState
              message={selectedRating ? `No ${selectedRating}-star reviews yet` : "No reviews yet"}
              subtitle={selectedRating ? "Try selecting a different rating filter" : "Reviews will appear here once customers submit them"}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;