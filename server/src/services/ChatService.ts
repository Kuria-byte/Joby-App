import { Message, IMessage } from '../models/Message';
import { Match } from '../models/Match';

export class ChatService {
  async saveMessage(matchId: string, senderId: string, content: string): Promise<IMessage> {
    try {
      // Update the match's lastMessageAt
      await Match.findByIdAndUpdate(matchId, {
        lastMessageAt: new Date(),
        status: 'active' // Ensure match is active when messages are exchanged
      });

      // Create and save the new message
      const message = await Message.create({
        matchId,
        senderId,
        content,
        type: 'text'
      });

      return message;
    } catch (error) {
      console.error('Error in saveMessage:', error);
      throw error;
    }
  }

  async getMessageHistory(matchId: string, limit: number = 50): Promise<IMessage[]> {
    try {
      return await Message.find({ matchId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('Error in getMessageHistory:', error);
      throw error;
    }
  }

  async markMessagesAsRead(matchId: string, userId: string): Promise<void> {
    try {
      await Message.updateMany(
        {
          matchId,
          senderId: { $ne: userId },
          readAt: null
        },
        {
          readAt: new Date()
        }
      );
    } catch (error) {
      console.error('Error in markMessagesAsRead:', error);
      throw error;
    }
  }
}
