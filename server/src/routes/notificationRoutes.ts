import express from 'express';
import { authenticateToken } from '../middleware/auth';
import NotificationService from '../services/NotificationService';

const router = express.Router();

router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const subscription = req.body;
    const userId = req.user.id;

    await NotificationService.saveSubscription(userId, subscription);
    res.status(201).json({ message: 'Subscription saved successfully' });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

export default router;
