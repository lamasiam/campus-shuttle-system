import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { runAsync, getAsync, allAsync } from '../db/connection.js';

const router = express.Router();

// Get all routes
router.get('/routes', async (req, res) => {
  try {
    const routes = await allAsync('SELECT * FROM routes');
    res.json(routes.map(r => ({ ...r, stops: JSON.parse(r.stops) })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// Create route
router.post('/routes', async (req, res) => {
  try {
    const { name, description, color, stops, frequency, operatingHours, estimatedDuration } = req.body;
    const routeId = uuidv4();

    await runAsync(
      `INSERT INTO routes (id, name, description, color, stops, frequency, operatingHours, estimatedDuration) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [routeId, name, description, color, JSON.stringify(stops), frequency, operatingHours, estimatedDuration]
    );

    res.status(201).json({ success: true, routeId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create route' });
  }
});

// Update route
router.put('/routes/:routeId', async (req, res) => {
  try {
    const { name, description, color, stops, frequency, operatingHours, estimatedDuration } = req.body;

    await runAsync(
      `UPDATE routes SET name = ?, description = ?, color = ?, stops = ?, frequency = ?, operatingHours = ?, estimatedDuration = ? 
       WHERE id = ?`,
      [name, description, color, JSON.stringify(stops), frequency, operatingHours, estimatedDuration, req.params.routeId]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update route' });
  }
});

// Get all schedules
router.get('/schedules', async (req, res) => {
  try {
    const schedules = await allAsync(
      `SELECT s.*, r.name as routeName, sh.vehicleNumber, u.name as driverName 
       FROM schedules s 
       JOIN routes r ON s.routeId = r.id 
       LEFT JOIN shuttles sh ON s.shuttleId = sh.id 
       LEFT JOIN users u ON s.driverId = u.id 
       ORDER BY s.departureTime`
    );
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Create schedule
router.post('/schedules', async (req, res) => {
  try {
    const { routeId, shuttleId, driverId, departureTime } = req.body;
    const scheduleId = uuidv4();

    await runAsync(
      `INSERT INTO schedules (id, routeId, shuttleId, driverId, departureTime, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [scheduleId, routeId, shuttleId, driverId, departureTime, 'scheduled']
    );

    res.status(201).json({ success: true, scheduleId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

// Assign driver to schedule
router.put('/schedules/:scheduleId/driver', async (req, res) => {
  try {
    const { driverId } = req.body;

    await runAsync(
      'UPDATE schedules SET driverId = ? WHERE id = ?',
      [driverId, req.params.scheduleId]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign driver' });
  }
});

export default router;
