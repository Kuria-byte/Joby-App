import React, { useState } from 'react';
import JobCard from '../JobCard/JobCard';
import './SwipeDeck.css';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
}

interface SwipeDeckProps {
  jobs: Job[];
  onSwipeLeft: (jobId: string) => void;
  onSwipeRight: (jobId: string) => void;
}

const SwipeDeck: React.FC<SwipeDeckProps> = ({ jobs, onSwipeLeft, onSwipeRight }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentJob = jobs[currentIndex];
    if (direction === 'left') {
      onSwipeLeft(currentJob.id);
    } else {
      onSwipeRight(currentJob.id);
    }
    setCurrentIndex(prev => Math.min(prev + 1, jobs.length - 1));
  };

  return (
    <div className="swipe-deck">
      {currentIndex < jobs.length && (
        <div className="card-container">
          <JobCard {...jobs[currentIndex]} />
          <div className="action-buttons">
            <button onClick={() => handleSwipe('left')}>✕</button>
            <button onClick={() => handleSwipe('right')}>✓</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeDeck;
