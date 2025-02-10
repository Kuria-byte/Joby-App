import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import './Chat.css';
import { Match } from '../../services/matchingService';

interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface ChatProps {
  match: Match;
  userId: string;
  onClose: () => void;
}

const Chat: React.FC<ChatProps> = ({ match, userId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:3000', {
      query: {
        matchId: match.id,
        userId: userId
      }
    });

    // Socket event listeners
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    socketRef.current.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('previousMessages', (previousMessages: Message[]) => {
      setMessages(previousMessages);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [match.id, userId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit('sendMessage', {
      matchId: match.id,
      senderId: userId,
      content: newMessage,
      timestamp: new Date().toISOString()
    });

    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>{match.companyName} - {match.jobTitle}</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.senderId === userId ? 'sent' : 'received'}`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <button type="submit" disabled={!isConnected || !newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
