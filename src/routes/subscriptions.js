import express from 'express';
import prisma from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create new subscription
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { playerId, startDate, endDate, amount, transportFee, uniformFee } = req.body;

    const subscription = await prisma.subscription.create({
      data: {
        playerId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        amount,
        transportFee,
        uniformFee,
        status: 'ACTIVE'
      }
    });

    res.status(201).json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get player subscriptions
router.get('/player/:playerId', authenticateToken, async (req, res) => {
  try {
    const { playerId } = req.params;
    const subscriptions = await prisma.subscription.findMany({
      where: { playerId },
      include: { payments: true }
    });
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;