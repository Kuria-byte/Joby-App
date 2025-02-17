import React, { useState, useRef, useCallback } from 'react';
import { useSwipeable, SwipeEventData } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import JobCard from '../JobCard/JobCard';
import JobDetailModal from '../../pages/Job Modal/JobDetailModal';// Import the modal component
import JobInfoPanel from '../JobCard/JobInfoPanel';// Import the new panel component
import { Job } from '../../services/api';
import { jobAPI } from '../../services/jobAPI';
import { logError, showErrorToast } from '../../utils/errorUtils';
import './SwipeDeck.css';
import { FaHeart, FaTimes, FaArrowLeft, FaInfoCircle } from 'react-icons/fa'; // Import icons

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
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleSwipeAction = useCallback(async (direction: 'left' | 'right') => {
    if (isProcessing) return;

    setIsProcessing(true);
    setExitX(direction === 'right' ? 1000 : -1000);

    setCurrentIndex(prev => {
      const newIndex = prev + 1;
      if (newIndex >= jobs.length) {
        onStackEmpty();
      }
      return newIndex;
    });

    setIsProcessing(false);
    setSwipeDistance(0);
    setExitX(0);
  }, [currentIndex, jobs, onStackEmpty]);

  const handleLogout = () => {
    console.log('User logged out');
    // Add your logout logic here, e.g., clearing user session or redirecting
  };

  const handleJobSelect = (job: Job) => {
    const jobDetails = {
      id: job.id,
      title: job.title,
      company: job.company,
      description: job.description,
      location: job.location,
      salary: job.salary !== undefined ? job.salary : 'Not specified', 
      requirements: job.requirements !== undefined ? job.requirements : 'Not specified',
      jobType: job.jobType !== undefined ? job.jobType : 'Full-time',
      postedDate: job.postedDate !== undefined ? job.postedDate : 'Recently',
      imageUrl: job.imageUrl !== undefined ? job.imageUrl : '',
    };
    setSelectedJob(jobDetails);
    setIsModalOpen(true);
  };

  const handleJobInfo = (job: Job) => {
    setSelectedJob(job);
    setIsPanelOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedJob(null);
  };

  const handleLike = () => {
    handleSwipeAction('right');
  };

  const handleReject = () => {
    handleSwipeAction('left');
  };

  const handleRevert = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

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
          <JobCard job={currentJob} onSelect={handleJobSelect} onInfo={handleJobInfo} />
        </motion.div>
      </AnimatePresence>
      {currentIndex < jobs.length - 1 && (
        <div className="next-card-preview">
          <JobCard job={jobs[currentIndex + 1]}  onSelect={handleJobSelect} onInfo={handleJobInfo} />
        </div>
      )}
      {isModalOpen && <JobDetailModal job={selectedJob} onClose={closeModal} />}
      {isPanelOpen && selectedJob && <JobInfoPanel job={selectedJob} onClose={handleClosePanel} />}
      <div className="floating-icons">
        <button className="icon revert" onClick={handleRevert}>
          <FaArrowLeft />
        </button>
        <div className="icon reject" onClick={() => handleReject()}>
          <FaTimes />
        </div>
        <div className="icon like" onClick={() => handleLike()}>
          <FaHeart />
        </div>
        <div className="icon info" onClick={() => handleJobInfo(currentJob)}>
          <FaInfoCircle />
        </div>
      </div>
    </div>
  );
};

export default SwipeDeck;
