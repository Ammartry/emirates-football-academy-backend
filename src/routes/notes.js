import express from 'express';
import prisma from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Add note to player
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { playerId, message, type } = req.body;
    const note = await prisma.note.create({
      data: {
        playerId,
        userId: req.user.id,
        message,
        type
      }
    });
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get player notes
router.get('/player/:playerId', authenticateToken, async (req, res) => {
  try {
    const { playerId } = req.params;
    const notes = await prisma.note.findMany({
      where: { playerId },
      include: {
        user: {
          select: {
            name: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;