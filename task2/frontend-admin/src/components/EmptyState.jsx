import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ message = "No reviews yet", subtitle = "Reviews will appear here once submitted" }) => {
  return (
    <div className="empty-state">
      <Inbox />
      <h3>{message}</h3>
      <p>{subtitle}</p>
    </div>
  );
};

export default EmptyState;