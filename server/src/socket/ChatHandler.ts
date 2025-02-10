import { Server, Socket } from 'socket.io';
import { ChatService } from '../services/ChatService';
import { MatchingService } from '../services/MatchingService';

export class ChatHandler {
  private io: Server;
  private chatService: ChatService;
  private matchingService: MatchingService;

  constructor(io: Server) {
    this.io = io;
    this.chatService = new ChatService();
    this.matchingService = new MatchingService();
  }

  handleConnection(socket: Socket): void {
    const { userId, matchId } = socket.handshake.query;

    if (!userId || !matchId) {
      socket.disconnect();
      return;
    }

    // Join the room for this match
    socket.join(`match:${matchId}`);

    // Handle incoming messages
    socket.on('sendMessage', async (data: { content: string }) => {
      try {
        const message = await this.chatService.saveMessage(
          matchId as string,
          userId as string,
          data.content
        );

        // Broadcast the message to all users in the match room
        this.io.to(`match:${matchId}`).emit('message', message);
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing', () => {
      socket.to(`match:${matchId}`).emit('userTyping', { userId });
    });

    socket.on('stopTyping', () => {
      socket.to(`match:${matchId}`).emit('userStoppedTyping', { userId });
    });

    // Handle message read status
    socket.on('markRead', async () => {
      try {
        await this.chatService.markMessagesAsRead(matchId as string, userId as string);
        socket.to(`match:${matchId}`).emit('messagesRead', { userId });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Load message history
    this.loadMessageHistory(socket, matchId as string);

    // Handle disconnection
    socket.on('disconnect', () => {
      socket.leave(`match:${matchId}`);
    });
  }

  private async loadMessageHistory(socket: Socket, matchId: string): Promise<void> {
    try {
      const messages = await this.chatService.getMessageHistory(matchId);
      socket.emit('previousMessages', messages);
    } catch (error) {
      console.error('Error loading message history:', error);
      socket.emit('error', { message: 'Failed to load message history' });
    }
  }
}
