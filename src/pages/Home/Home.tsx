import React, { useEffect, useState } from 'react';
import SwipeDeck from '../../components/SwipeDeck/SwipeDeck';
import { api, Job } from '../../services/api';
import { jobAPI } from '../../services/jobAPI';
import './Home.css';

const MOCK_USER_ID = 'user123'; // Replace this with actual user ID from your auth system

const Home: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStackEmpty = async () => {
    setLoading(true);
    try {
      // Get more job recommendations
      const newJobs = await jobAPI.getJobRecommendations(MOCK_USER_ID);
      setJobs(newJobs);
    } catch (err) {
      setError('Failed to load more jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: Error) => {
    console.error('SwipeDeck error:', error);
    setError('An error occurred. Please try again.');
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
        userId={MOCK_USER_ID}
        onStackEmpty={handleStackEmpty}
        onError={handleError}
      />
    </div>
  );
};

export default Home;
