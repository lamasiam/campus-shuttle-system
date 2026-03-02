import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { runAsync, getAsync, allAsync } from '../db/connection.js';

const router = express.Router();

// Get user notifications
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await allAsync(
      'SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC',
      [req.params.userId]
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get unread count
router.get('/:userId/unread', async (req, res) => {
  try {
    const result = await getAsync(
      'SELECT COUNT(*) as count FROM notifications WHERE userId = ? AND isRead = 0',
      [req.params.userId]
    );
    res.json({ unreadCount: result.count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Mark as read
router.put('/:notificationId/read', async (req, res) => {
  try {
    await runAsync(
      'UPDATE notifications SET isRead = 1 WHERE id = ?',
      [req.params.notificationId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// Create notification
router.post('/', async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    const notificationId = uuidv4();

    await runAsync(
      `INSERT INTO notifications (id, userId, title, message, type, isRead) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [notificationId, userId, title, message, type, 0]
    );

    res.status(201).json({ success: true, notificationId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

export default router;
