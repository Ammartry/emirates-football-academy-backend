import express from 'express';
import prisma from '../config/database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get all players
router.get('/', authenticateToken, async (req, res) => {
  try {
    const players = await prisma.player.findMany({
      include: {
        subscriptions: true,
        notes: {
          include: {
            user: {
              select: {
                name: true,
                role: true
              }
            }
          }
        }
      }
    });
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new player
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      birthDate,
      nationality,
      playerType,
      photo,
      idCard,
      uniformSize,
      transport,
      parentName,
      parentEmail,
      parentPhone
    } = req.body;

    const player = await prisma.player.create({
      data: {
        registrationId: `EFA-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        name,
        birthDate: new Date(birthDate),
        nationality,
        playerType,
        photo,
        idCard,
        uniformSize,
        transport,
        parentName,
        parentEmail,
        parentPhone
      }
    });

    res.status(201).json(player);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;