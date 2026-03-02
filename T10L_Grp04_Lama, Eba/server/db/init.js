import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/shuttle.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Create tables
const createTables = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('student', 'driver', 'coordinator', 'admin')),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err);
      else console.log('✓ Users table created');
    });

    // Routes table
    db.run(`
      CREATE TABLE IF NOT EXISTS routes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        color TEXT,
        stops TEXT NOT NULL,
        frequency TEXT,
        operatingHours TEXT,
        estimatedDuration TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating routes table:', err);
      else console.log('✓ Routes table created');
    });

    // Shuttles table
    db.run(`
      CREATE TABLE IF NOT EXISTS shuttles (
        id TEXT PRIMARY KEY,
        vehicleNumber TEXT UNIQUE NOT NULL,
        model TEXT,
        capacity INTEGER,
        status TEXT DEFAULT 'available',
        lat REAL,
        lng REAL,
        routeId TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (routeId) REFERENCES routes(id)
      )
    `, (err) => {
      if (err) console.error('Error creating shuttles table:', err);
      else console.log('✓ Shuttles table created');
    });

    // Schedules table
    db.run(`
      CREATE TABLE IF NOT EXISTS schedules (
        id TEXT PRIMARY KEY,
        routeId TEXT NOT NULL,
        shuttleId TEXT,
        driverId TEXT,
        departureTime DATETIME NOT NULL,
        estimatedArrival DATETIME,
        status TEXT DEFAULT 'scheduled',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (routeId) REFERENCES routes(id),
        FOREIGN KEY (shuttleId) REFERENCES shuttles(id),
        FOREIGN KEY (driverId) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('Error creating schedules table:', err);
      else console.log('✓ Schedules table created');
    });

    // Bookings table
    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        scheduleId TEXT NOT NULL,
        qrCode TEXT UNIQUE NOT NULL,
        pickupStop INTEGER,
        dropoffStop INTEGER,
        status TEXT DEFAULT 'confirmed',
        bookingDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES users(id),
        FOREIGN KEY (scheduleId) REFERENCES schedules(id)
      )
    `, (err) => {
      if (err) console.error('Error creating bookings table:', err);
      else console.log('✓ Bookings table created');
    });

    // Trips table
    db.run(`
      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        scheduleId TEXT NOT NULL,
        status TEXT DEFAULT 'not_started',
        currentLat REAL,
        currentLng REAL,
        startTime DATETIME,
        endTime DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (scheduleId) REFERENCES schedules(id)
      )
    `, (err) => {
      if (err) console.error('Error creating trips table:', err);
      else console.log('✓ Trips table created');
    });

    // Incidents table
    db.run(`
      CREATE TABLE IF NOT EXISTS incidents (
        id TEXT PRIMARY KEY,
        tripId TEXT NOT NULL,
        reportedBy TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        severity TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'open',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tripId) REFERENCES trips(id),
        FOREIGN KEY (reportedBy) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('Error creating incidents table:', err);
      else console.log('✓ Incidents table created');
    });

    // Notifications table
    db.run(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT,
        type TEXT,
        isRead BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('Error creating notifications table:', err);
      else console.log('✓ Notifications table created');
    });

    console.log('\n✅ All tables created successfully!');
  });
};

createTables();

// Close database
setTimeout(() => {
  db.close((err) => {
    if (err) console.error('Error closing database:', err);
    else console.log('\nDatabase initialization complete!');
  });
}, 2000);
