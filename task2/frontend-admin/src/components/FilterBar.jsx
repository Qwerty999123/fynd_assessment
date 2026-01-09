import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const FilterBar = ({ selectedRating, onRatingChange, onReset }) => {
  return (
    <div className="filter-bar">
      <div className="filter-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={20} style={{ color: 'var(--gray-600)' }} />
          <span style={{ fontWeight: 600, color: 'var(--gray-700)', fontSize: 'var(--font-size-base)' }}>
            Filter Reviews
          </span>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Rating</label>
          <select 
            className="filter-select"
            value={selectedRating || ''}
            onChange={(e) => onRatingChange(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            <option value="3">⭐⭐⭐ (3 Stars)</option>
            <option value="2">⭐⭐ (2 Stars)</option>
            <option value="1">⭐ (1 Star)</option>
          </select>
        </div>

        {selectedRating && (
          <button 
            className="btn btn-secondary btn-icon"
            onClick={onReset}
            title="Reset filters"
          >
            <RotateCcw size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;