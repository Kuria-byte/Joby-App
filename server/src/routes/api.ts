import express from 'express';
import { store, getNextId } from '../data/inMemoryStore';

const router = express.Router();

// Auth Routes
router.post('/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const userId = getNextId('user');
  store.users.set(userId, { id: userId, email, password, name });
  
  res.status(201).json({ id: userId, email, name });
});

// Jobs Routes
router.get('/jobs', (_, res) => {
  const jobs = Array.from(store.jobs.values());
  res.json(jobs);
});

router.post('/jobs', (req, res) => {
  const { title, company, description, skills } = req.body;
  
  if (!title || !company || !description || !skills) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const jobId = getNextId('job');
  const job = { id: jobId, title, company, description, skills };
  store.jobs.set(jobId, job);
  
  res.status(201).json(job);
});

// Swipe Routes
router.post('/swipe', (req, res) => {
  const { userId, jobId, direction } = req.body;
  
  if (!userId || !jobId || !direction) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!store.users.has(userId) || !store.jobs.has(jobId)) {
    return res.status(404).json({ error: 'User or job not found' });
  }

  const userSwipes = store.swipes.get(userId) || [];
  userSwipes.push({ userId, jobId, direction });
  store.swipes.set(userId, userSwipes);
  
  res.status(201).json({ success: true });
});

// Chat Routes
router.get('/chat/:userId', (req, res) => {
  const { userId } = req.params;
  const messages = store.messages.get(userId) || [];
  res.json(messages);
});

router.post('/chat', (req, res) => {
  const { senderId, receiverId, content } = req.body;
  
  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const message = {
    id: getNextId('msg'),
    senderId,
    receiverId,
    content,
    timestamp: new Date()
  };

  const senderMessages = store.messages.get(senderId) || [];
  senderMessages.push(message);
  store.messages.set(senderId, senderMessages);

  const receiverMessages = store.messages.get(receiverId) || [];
  receiverMessages.push(message);
  store.messages.set(receiverId, receiverMessages);
  
  res.status(201).json(message);
});

export default router;
