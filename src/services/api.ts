const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  imageUrl?: string;
  postedDate?: string;
  jobType?: string;
}

export const api = {
  async getJobs(): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    const jobs = await response.json();
    
    // Add default values for optional fields if they're missing
    return jobs.map((job: Job) => ({
      ...job,
      salary: job.salary || 'Salary not specified',
      jobType: job.jobType || 'Full-time',
      postedDate: job.postedDate || 'Recently'
    }));
  },

  async likeJob(jobId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to like job');
    }
  },

  async passJob(jobId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/pass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to pass job');
    }
  },
};
