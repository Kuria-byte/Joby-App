import { Match, IMatch } from '../models/Match';

export class MatchingService {
  async checkForMatch(userId: string, jobId: string, employerId: string, jobTitle: string, companyName: string): Promise<IMatch | null> {
    try {
      // Check if employer has already shown interest
      const existingMatch = await Match.findOne({ jobId, userId });
      
      if (existingMatch) {
        // Update match status to active if it was pending
        if (existingMatch.status === 'pending') {
          existingMatch.status = 'active';
          await existingMatch.save();
        }
        return existingMatch;
      }

      // Create a new pending match
      const newMatch = await Match.create({
        jobId,
        userId,
        employerId,
        jobTitle,
        companyName,
        status: 'pending'
      });

      return null; // No mutual match yet
    } catch (error) {
      console.error('Error in checkForMatch:', error);
      throw error;
    }
  }

  async getUserMatches(userId: string): Promise<IMatch[]> {
    try {
      return await Match.find({
        userId,
        status: { $in: ['active', 'pending'] }
      }).sort({ lastMessageAt: -1, matchedAt: -1 });
    } catch (error) {
      console.error('Error in getUserMatches:', error);
      throw error;
    }
  }

  async updateMatchStatus(matchId: string, status: IMatch['status']): Promise<IMatch | null> {
    try {
      return await Match.findByIdAndUpdate(
        matchId,
        { status },
        { new: true }
      );
    } catch (error) {
      console.error('Error in updateMatchStatus:', error);
      throw error;
    }
  }
}
