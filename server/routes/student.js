import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { runAsync, getAsync, allAsync } from '../db/connection.js';

const router = express.Router();

// Get all routes
router.get('/routes', async (req, res) => {
  try {
    const routes = await allAsync('SELECT * FROM routes');
    res.json(routes.map(r => ({
      ...r,
      stops: JSON.parse(r.stops)
    })));
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// Get route details with schedules
router.get('/routes/:routeId', async (req, res) => {
  try {
    const route = await getAsync('SELECT * FROM routes WHERE id = ?', [req.params.routeId]);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const schedules = await allAsync(
      'SELECT * FROM schedules WHERE routeId = ? ORDER BY departureTime',
      [req.params.routeId]
    );

    res.json({
      ...route,
      stops: JSON.parse(route.stops),
      schedules
    });
  } catch (error) {
    console.error('Error fetching route details:', error);
    res.status(500).json({ error: 'Failed to fetch route details' });
  }
});

// Create booking
router.post('/bookings', async (req, res) => {
  try {
    const { studentId, scheduleId, pickupStop, dropoffStop } = req.body;

    if (!studentId || !scheduleId) {
      return res.status(400).json({ error: 'Student ID and Schedule ID required' });
    }

    const qrCodeData = uuidv4();
    const bookingId = uuidv4();

    await runAsync(
      `INSERT INTO bookings (id, studentId, scheduleId, qrCode, pickupStop, dropoffStop, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [bookingId, studentId, scheduleId, qrCodeData, pickupStop || 0, dropoffStop || 0, 'confirmed']
    );

    // Generate QR code
    const qrCode = await QRCode.toDataURL(qrCodeData);

    res.status(201).json({
      success: true,
      bookingId,
      qrCode,
      qrCodeData
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get student bookings
router.get('/bookings/:studentId', async (req, res) => {
  try {
    const bookings = await allAsync(
      `SELECT b.*, s.departureTime, r.name as routeName 
       FROM bookings b 
       JOIN schedules s ON b.scheduleId = s.id 
       JOIN routes r ON s.routeId = r.id 
       WHERE b.studentId = ? 
       ORDER BY s.departureTime DESC`,
      [req.params.studentId]
    );

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Cancel booking
router.put('/bookings/:bookingId/cancel', async (req, res) => {
  try {
    await runAsync(
      'UPDATE bookings SET status = ? WHERE id = ?',
      ['cancelled', req.params.bookingId]
    );

    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;
