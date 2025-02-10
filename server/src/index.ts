import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { ChatHandler } from './socket/ChatHandler';
import { MatchingService } from './services/MatchingService';
import { ChatService } from './services/ChatService';
import apiRoutes from './routes/api';
import notificationRoutes from './routes/notificationRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/api/notifications', notificationRoutes);

// Services
const matchingService = new MatchingService();
const chatService = new ChatService();

// Socket.IO setup
const chatHandler = new ChatHandler(io);
io.on('connection', (socket) => chatHandler.handleConnection(socket));

// API Routes
app.post('/api/matches/check', async (req, res) => {
  try {
    const { userId, jobId, employerId, jobTitle, companyName } = req.body;
    const match = await matchingService.checkForMatch(userId, jobId, employerId, jobTitle, companyName);
    res.json({ isMatch: !!match, match });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check for match' });
  }
});

app.get('/api/matches/user/:userId', async (req, res) => {
  try {
    const matches = await matchingService.getUserMatches(req.params.userId);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

app.get('/api/messages/:matchId', async (req, res) => {
  try {
    const messages = await chatService.getMessageHistory(req.params.matchId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/joby')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    const PORT = process.env.PORT || 3001;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
