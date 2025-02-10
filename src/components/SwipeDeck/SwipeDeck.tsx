import React, { useState, useRef } from 'react';
import { useSwipeable, SwipeEventData } from 'react-swipeable';
import JobCard from '../JobCard/JobCard';
import { Job } from '../../services/api';
import './SwipeDeck.css';

interface SwipeDeckProps {
  jobs: Job[];
  onSwipeLeft: (jobId: string) => void;
  onSwipeRight: (jobId: string) => void;
}

const SWIPE_THRESHOLD = 100; // pixels to trigger swipe
const ROTATION_ANGLE = 12; // maximum rotation angle in degrees

const SwipeDeck: React.FC<SwipeDeckProps> = ({ jobs, onSwipeLeft, onSwipeRight }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating || currentIndex >= jobs.length) return;

    setIsAnimating(true);
    const currentJob = jobs[currentIndex];

    // Trigger the appropriate callback
    if (direction === 'left') {
      onSwipeLeft(currentJob.id);
    } else {
      onSwipeRight(currentJob.id);
    }

    // Animate the card off screen
    setSwipeDistance(direction === 'left' ? -window.innerWidth : window.innerWidth);

    // Reset and move to next card
    setTimeout(() => {
      setCurrentIndex(prev => Math.min(prev + 1, jobs.length));
      setSwipeDistance(0);
      setIsAnimating(false);
    }, 300);
  };

  const handlers = useSwipeable({
    onSwiping: (eventData: SwipeEventData) => {
      if (!isAnimating) {
        setSwipeDistance(eventData.deltaX);
      }
    },
    onSwiped: (eventData: SwipeEventData) => {
      if (Math.abs(eventData.deltaX) >= SWIPE_THRESHOLD) {
        handleSwipe(eventData.deltaX > 0 ? 'right' : 'left');
      } else {
        setSwipeDistance(0); // Reset position if swipe wasn't far enough
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
    trackTouch: true,
  });

  // Calculate rotation and opacity based on swipe distance
  const rotation = (swipeDistance / window.innerWidth) * ROTATION_ANGLE;
  const opacity = Math.max(1 - Math.abs(swipeDistance) / (window.innerWidth / 2), 0);

  const getCardStyle = (index: number): React.CSSProperties => {
    if (index === currentIndex) {
      return {
        transform: `translateX(${swipeDistance}px) rotate(${rotation}deg)`,
        opacity: opacity,
        zIndex: jobs.length - index,
      };
    }
    // Style for the next card in the stack
    if (index === currentIndex + 1) {
      const scale = 0.95 + (0.05 * Math.abs(swipeDistance) / window.innerWidth);
      return {
        transform: `scale(${scale})`,
        opacity: 0.8 + (0.2 * Math.abs(swipeDistance) / window.innerWidth),
        zIndex: jobs.length - index,
      };
    }
    // Style for other cards in the stack
    return {
      transform: `scale(${0.95 - (index - currentIndex - 1) * 0.05})`,
      opacity: Math.max(0.8 - (index - currentIndex - 1) * 0.2, 0),
      zIndex: jobs.length - index,
    };
  };

  return (
    <div className="swipe-deck">
      <div className="cards-container">
        {jobs.slice(currentIndex, currentIndex + 3).map((job, index) => (
          <div
            key={job.id}
            className="card-wrapper"
            style={getCardStyle(currentIndex + index)}
            {...(index === 0 ? handlers : {})}
            ref={index === 0 ? cardRef : undefined}
          >
            <JobCard
              title={job.title}
              company={job.company}
              location={job.location}
              description={job.description}
              salary={job.salary || 'Salary not specified'}
              imageUrl={job.imageUrl}
              postedDate={job.postedDate}
              jobType={job.jobType}
            />
          </div>
        ))}
      </div>
      
      <div className="swipe-buttons">
        <button 
          className="swipe-button reject"
          onClick={() => handleSwipe('left')}
          disabled={isAnimating || currentIndex >= jobs.length}
        >
          ✕
        </button>
        <button 
          className="swipe-button accept"
          onClick={() => handleSwipe('right')}
          disabled={isAnimating || currentIndex >= jobs.length}
        >
          ✓
        </button>
      </div>
    </div>
  );
};

export default SwipeDeck;
