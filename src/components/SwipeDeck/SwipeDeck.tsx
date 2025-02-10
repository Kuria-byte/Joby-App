import React, { useState, useRef, useCallback } from 'react';
import { useSwipeable, SwipeEventData } from 'react-swipeable';
import JobCard from '../JobCard/JobCard';
import { Job } from '../../services/api';
import { jobAPI } from '../../services/jobAPI';
import './SwipeDeck.css';

interface SwipeDeckProps {
  jobs: Job[];
  userId: string;
  onStackEmpty: () => void;
  onError?: (error: Error) => void;
}

const SWIPE_THRESHOLD = 100; // pixels to trigger swipe
const ROTATION_ANGLE = 12; // maximum rotation angle in degrees

const SwipeDeck: React.FC<SwipeDeckProps> = ({ jobs, userId, onStackEmpty, onError }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSwipeAction = useCallback(async (direction: 'left' | 'right') => {
    if (isProcessing) return;

    const currentJob = jobs[currentIndex];
    setIsProcessing(true);

    try {
      if (direction === 'right') {
        await jobAPI.recordJobInterest(currentJob.id, userId);
      } else {
        await jobAPI.dismissJob(currentJob.id, userId);
      }

      setCurrentIndex(prev => {
        const newIndex = prev + 1;
        if (newIndex >= jobs.length) {
          onStackEmpty();
        }
        return newIndex;
      });
    } catch (error) {
      console.error(`Error processing ${direction} swipe:`, error);
      onError?.(error as Error);
    } finally {
      setIsProcessing(false);
      setSwipeDistance(0);
    }
  }, [currentIndex, jobs, userId, isProcessing, onStackEmpty, onError]);

  const handlers = useSwipeable({
    onSwiping: (eventData: SwipeEventData) => {
      if (!isProcessing) {
        setSwipeDistance(eventData.deltaX);
      }
    },
    onSwiped: (eventData: SwipeEventData) => {
      if (!isProcessing && Math.abs(eventData.deltaX) >= SWIPE_THRESHOLD) {
        handleSwipeAction(eventData.deltaX > 0 ? 'right' : 'left');
      } else {
        setSwipeDistance(0);
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
        position: 'absolute',
      };
    }
    return {
      transform: 'scale(0.95)',
      opacity: Math.max(1 - (index - currentIndex) * 0.2, 0),
      zIndex: jobs.length - index,
      position: 'absolute',
    };
  };

  return (
    <div className="swipe-deck-container" {...handlers}>
      {jobs.slice(currentIndex, currentIndex + 3).map((job, index) => (
        <div
          key={job.id}
          className="card-container"
          style={getCardStyle(currentIndex + index)}
        >
          <JobCard job={job} />
        </div>
      ))}
      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default SwipeDeck;
