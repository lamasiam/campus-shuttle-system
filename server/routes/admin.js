import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { runAsync, getAsync, allAsync } from '../db/connection.js';

const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await allAsync('SELECT id, name, email, role, createdAt FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    await runAsync(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, role]
    );

    res.status(201).json({ success: true, userId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user role
router.put('/users/:userId/role', async (req, res) => {
  try {
    const { role } = req.body;

    await runAsync(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, req.params.userId]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Get all shuttles
router.get('/shuttles', async (req, res) => {
  try {
    const shuttles = await allAsync('SELECT * FROM shuttles');
    res.json(shuttles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shuttles' });
  }
});

// Create shuttle
router.post('/shuttles', async (req, res) => {
  try {
    const { vehicleNumber, model, capacity, status, routeId } = req.body;
    const shuttleId = uuidv4();

    await runAsync(
      `INSERT INTO shuttles (id, vehicleNumber, model, capacity, status, routeId) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [shuttleId, vehicleNumber, model, capacity, status || 'available', routeId]
    );

    res.status(201).json({ success: true, shuttleId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shuttle' });
  }
});

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await getAsync('SELECT COUNT(*) as count FROM users');
    const totalShuttles = await getAsync('SELECT COUNT(*) as count FROM shuttles');
    const totalRoutes = await getAsync('SELECT COUNT(*) as count FROM routes');
    const totalBookings = await getAsync('SELECT COUNT(*) as count FROM bookings');

    res.json({
      totalUsers: totalUsers.count,
      totalShuttles: totalShuttles.count,
      totalRoutes: totalRoutes.count,
      totalBookings: totalBookings.count
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
