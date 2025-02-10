import axios from 'axios';
import { Job } from './api';
import { matchingService, MatchResponse } from './matchingService';

const API_BASE_URL = 'http://localhost:3000/api'; // Change this to your actual API base URL

export interface JobInterestData {
  jobId: string;
  userId: string;
  action: 'interested' | 'dismissed';
  timestamp: string;
}

export const jobAPI = {
  // Record user's interest in a job
  recordJobInterest: async (jobId: string, userId: string): Promise<MatchResponse> => {
    try {
      const data: JobInterestData = {
        jobId,
        userId,
        action: 'interested',
        timestamp: new Date().toISOString(),
      };
      
      await axios.post(`${API_BASE_URL}/jobs/interest`, data);
      
      // Check for a match after recording interest
      return await matchingService.checkForMatch(userId, jobId);
    } catch (error) {
      console.error('Error recording job interest:', error);
      throw error;
    }
  },

  // Record job dismissal
  dismissJob: async (jobId: string, userId: string): Promise<void> => {
    try {
      const data: JobInterestData = {
        jobId,
        userId,
        action: 'dismissed',
        timestamp: new Date().toISOString(),
      };
      
      await axios.post(`${API_BASE_URL}/jobs/dismiss`, data);
    } catch (error) {
      console.error('Error dismissing job:', error);
      throw error;
    }
  },

  // Get job recommendations
  getJobRecommendations: async (userId: string, limit: number = 10): Promise<Job[]> => {
    try {
      const response = await axios.get<Job[]>(`${API_BASE_URL}/jobs/recommendations`, {
        params: { userId, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      throw error;
    }
  }
};
