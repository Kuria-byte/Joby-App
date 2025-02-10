import React, { useEffect, useState } from 'react';
import SwipeDeck from '../../components/SwipeDeck/SwipeDeck';
import { api, Job } from '../../services/api';
import './Home.css';

const Home: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await api.getJobs();
        setJobs(fetchedJobs);
        setLoading(false);
      } catch (err) {
        setError('Failed to load jobs. Please try again later.');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSwipeLeft = async (jobId: string) => {
    try {
      await api.passJob(jobId);
    } catch (err) {
      console.error('Failed to pass job:', err);
    }
  };

  const handleSwipeRight = async (jobId: string) => {
    try {
      await api.likeJob(jobId);
    } catch (err) {
      console.error('Failed to like job:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading jobs...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home">
      <SwipeDeck
        jobs={jobs}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      />
    </div>
  );
};

export default Home;
