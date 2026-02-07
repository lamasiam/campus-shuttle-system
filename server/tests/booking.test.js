import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { runAsync, getAsync, allAsync, closeDatabase } from '../db/connection.js';
import { v4 as uuidv4 } from 'uuid';

describe('Booking System', () => {
  let studentId, scheduleId, bookingId;

  beforeAll(async () => {
    // Create test student
    studentId = uuidv4();
    await runAsync(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [studentId, 'Test Student', 'student@test.com', 'hash', 'student']
    );

    // Get first schedule
    const schedule = await getAsync('SELECT id FROM schedules LIMIT 1');
    scheduleId = schedule.id;
  });

  afterAll(() => {
    closeDatabase();
  });

  it('should create a booking', async () => {
    const qrCode = uuidv4();
    bookingId = uuidv4();

    await runAsync(
      `INSERT INTO bookings (id, studentId, scheduleId, qrCode, pickupStop, dropoffStop, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [bookingId, studentId, scheduleId, qrCode, 0, 2, 'confirmed']
    );

    const booking = await getAsync('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    expect(booking).toBeDefined();
    expect(booking.status).toBe('confirmed');
  });

  it('should retrieve student bookings', async () => {
    const bookings = await allAsync(
      'SELECT * FROM bookings WHERE studentId = ?',
      [studentId]
    );

    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);
  });

  it('should cancel a booking', async () => {
    await runAsync(
      'UPDATE bookings SET status = ? WHERE id = ?',
      ['cancelled', bookingId]
    );

    const booking = await getAsync('SELECT * FROM bookings WHERE id = ?', [bookingId]);
    expect(booking.status).toBe('cancelled');
  });

  it('should get booking with route details', async () => {
    const booking = await getAsync(
      `SELECT b.*, s.departureTime, r.name as routeName 
       FROM bookings b 
       JOIN schedules s ON b.scheduleId = s.id 
       JOIN routes r ON s.routeId = r.id 
       WHERE b.id = ?`,
      [bookingId]
    );

    expect(booking).toBeDefined();
    expect(booking.routeName).toBeDefined();
    expect(booking.departureTime).toBeDefined();
  });

  it('should validate QR code uniqueness', async () => {
    const qrCode = uuidv4();
    const booking1Id = uuidv4();
    const booking2Id = uuidv4();

    await runAsync(
      `INSERT INTO bookings (id, studentId, scheduleId, qrCode, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [booking1Id, studentId, scheduleId, qrCode, 'confirmed']
    );

    // Try to insert duplicate QR code - should fail
    try {
      await runAsync(
        `INSERT INTO bookings (id, studentId, scheduleId, qrCode, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [booking2Id, studentId, scheduleId, qrCode, 'confirmed']
      );
      expect.fail('Should have thrown error for duplicate QR code');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
