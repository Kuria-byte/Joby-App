import React, { useState, useRef, useCallback } from 'react';
import { useSwipeable, SwipeEventData } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import JobCard from '../JobCard/JobCard';
import { Job } from '../../services/api';
import { jobAPI } from '../../services/jobAPI';
import { logError, showErrorToast } from '../../utils/errorUtils';
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
  const [exitX, setExitX] = useState(0);

  const handleSwipeAction = useCallback(async (direction: 'left' | 'right') => {
    if (isProcessing) return;

    const currentJob = jobs[currentIndex];
    setIsProcessing(true);
    setExitX(direction === 'right' ? 1000 : -1000);

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
      logError(error as Error, 'SwipeDeck', userId, {
        jobId: currentJob.id,
        action: direction
      });
      showErrorToast(error as Error);
      onError?.(error as Error);
    } finally {
      setIsProcessing(false);
      setSwipeDistance(0);
      setExitX(0);
    }
  }, [currentIndex, jobs, userId, isProcessing, onStackEmpty, onError]);

  const handlers = useSwipeable({
    onSwiping: (eventData: SwipeEventData) => {
      if (!isProcessing) {
        setSwipeDistance(eventData.deltaX);
      }
    },
    onSwipedLeft: () => {
      if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
        handleSwipeAction('left');
      } else {
        setSwipeDistance(0);
      }
    },
    onSwipedRight: () => {
      if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
        handleSwipeAction('right');
      } else {
        setSwipeDistance(0);
      }
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  if (currentIndex >= jobs.length) {
    return <div className="swipe-deck-empty">No more jobs to show</div>;
  }

  const currentJob = jobs[currentIndex];
  const rotation = (swipeDistance / SWIPE_THRESHOLD) * ROTATION_ANGLE;
  const opacity = Math.max(0, 1 - Math.abs(swipeDistance) / (SWIPE_THRESHOLD * 2));

  return (
    <div className="swipe-deck-container" {...handlers}>
      <AnimatePresence>
        <motion.div
          key={currentJob.id}
          className="card-container"
          initial={{ x: 0, opacity: 1 }}
          animate={{
            x: swipeDistance,
            rotate: rotation,
            opacity: opacity
          }}
          exit={{
            x: exitX,
            opacity: 0,
            transition: { duration: 0.2 }
          }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 150
          }}
        >
          <JobCard job={currentJob} />
        </motion.div>
      </AnimatePresence>
      {currentIndex < jobs.length - 1 && (
        <div className="next-card-preview">
          <JobCard job={jobs[currentIndex + 1]} />
        </div>
      )}
    </div>
  );
};

export default SwipeDeck;
