import { Job } from './api';

export interface Match {
  id: string;
  jobId: string;
  userId: string;
  employerId: string;
  jobTitle: string;
  companyName: string;
  matchedAt: string;
  status: 'pending' | 'active' | 'closed';
}

export interface MatchResponse {
  isMatch: boolean;
  match?: Match;
}

class MatchingService {
  private socket: WebSocket;

  constructor() {
    this.socket = new WebSocket('ws://localhost:3000/matches');
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'match') {
        this.handleNewMatch(data.match);
      }
    };
  }

  private handleNewMatch(match: Match) {
    // Dispatch a custom event that components can listen to
    const matchEvent = new CustomEvent('newMatch', { detail: match });
    window.dispatchEvent(matchEvent);
  }

  async checkForMatch(userId: string, jobId: string): Promise<MatchResponse> {
    try {
      const response = await fetch('http://localhost:3000/api/matches/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, jobId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to check for match');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking for match:', error);
      throw error;
    }
  }

  async getMatches(userId: string): Promise<Match[]> {
    try {
      const response = await fetch(`http://localhost:3000/api/matches/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }
}

export const matchingService = new MatchingService();
