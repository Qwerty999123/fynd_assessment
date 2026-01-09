import React from 'react';
import { 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Clock 
} from 'lucide-react';

const StatsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="stats-container">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Reviews',
      value: stats.total_reviews,
      icon: MessageSquare,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      title: 'Average Rating',
      value: stats.average_rating?.toFixed(1) || '0.0',
      subtitle: 'out of 5.0',
      icon: Star,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      title: 'Most Common',
      value: getMostCommonRating(stats.rating_distribution),
      subtitle: 'star rating',
      icon: TrendingUp,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      title: 'Last 24 Hours',
      value: stats.recent_count_24h,
      subtitle: 'new reviews',
      icon: Clock,
      color: '#8b5cf6',
      bgColor: '#ede9fe',
    },
  ];

  return (
    <div className="stats-container">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index} 
            className="stat-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="stat-card-header">
              <div className="stat-card-title">{card.title}</div>
              <div 
                className="stat-card-icon"
                style={{ 
                  backgroundColor: card.bgColor,
                  color: card.color 
                }}
              >
                <Icon size={24} />
              </div>
            </div>
            <div className="stat-card-value">{card.value}</div>
            {card.subtitle && (
              <div className="stat-card-subtitle">{card.subtitle}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Helper function to find most common rating
const getMostCommonRating = (distribution) => {
  if (!distribution) return 'N/A';
  
  let maxCount = 0;
  let mostCommon = 'N/A';
  
  Object.entries(distribution).forEach(([rating, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = rating;
    }
  });
  
  return mostCommon;
};

export default StatsCards;