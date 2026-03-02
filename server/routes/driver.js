import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { runAsync, getAsync, allAsync } from '../db/connection.js';

const router = express.Router();

// Get driver schedules
router.get('/schedules/:driverId', async (req, res) => {
  try {
    const schedules = await allAsync(
      `SELECT s.*, r.name as routeName, sh.vehicleNumber 
       FROM schedules s 
       JOIN routes r ON s.routeId = r.id 
       LEFT JOIN shuttles sh ON s.shuttleId = sh.id 
       WHERE s.driverId = ? 
       ORDER BY s.departureTime`,
      [req.params.driverId]
    );

    res.json(schedules);
  } catch (error) {
    console.error('Error fetching driver schedules:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Start trip
router.post('/trips', async (req, res) => {
  try {
    const { scheduleId } = req.body;

    if (!scheduleId) {
      return res.status(400).json({ error: 'Schedule ID required' });
    }

    const tripId = uuidv4();
    await runAsync(
      `INSERT INTO trips (id, scheduleId, status, startTime) VALUES (?, ?, ?, ?)`,
      [tripId, scheduleId, 'in_progress', new Date().toISOString()]
    );

    res.status(201).json({ success: true, tripId });
  } catch (error) {
    console.error('Error starting trip:', error);
    res.status(500).json({ error: 'Failed to start trip' });
  }
});

// Update trip location
router.put('/trips/:tripId/location', async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    await runAsync(
      'UPDATE trips SET currentLat = ?, currentLng = ? WHERE id = ?',
      [lat, lng, req.params.tripId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating trip location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Scan QR code
router.post('/scan-qr', async (req, res) => {
  try {
    const { qrCode } = req.body;

    if (!qrCode) {
      return res.status(400).json({ error: 'QR code required' });
    }

    const booking = await getAsync(
      `SELECT 
         b.*,
         u.name as passengerName,
         r.name as routeName,
         r.stops as routeStops,
         s.departureTime
       FROM bookings b
       JOIN users u ON b.studentId = u.id
       JOIN schedules s ON b.scheduleId = s.id
       JOIN routes r ON s.routeId = r.id
       WHERE b.qrCode = ?`,
      [qrCode]
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is cancelled' });
    }

    await runAsync(
      'UPDATE bookings SET status = ? WHERE id = ?',
      ['boarded', booking.id]
    );

    let pickupStopName;
    let dropoffStopName;
    try {
      const stops = JSON.parse(booking.routeStops || '[]');
      if (Array.isArray(stops)) {
        pickupStopName = stops[Number(booking.pickupStop)];
        dropoffStopName = stops[Number(booking.dropoffStop)];
      }
    } catch {
      pickupStopName = undefined;
      dropoffStopName = undefined;
    }

    const { routeStops: _, ...bookingWithoutStops } = booking;
    res.json({
      success: true,
      booking: { ...bookingWithoutStops, pickupStopName, dropoffStopName, status: 'boarded' }
    });
  } catch (error) {
    console.error('Error scanning QR:', error);
    res.status(500).json({ error: 'Failed to scan QR code' });
  }
});

export default router;
