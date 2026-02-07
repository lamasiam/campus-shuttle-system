import { runAsync, allAsync, getDatabase, closeDatabase } from './connection.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Create sample users
    const users = [
      {
        id: uuidv4(),
        name: 'Admin User',
        email: 'admin@campus.edu',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin'
      },
      {
        id: uuidv4(),
        name: 'John Driver',
        email: 'driver1@campus.edu',
        password: await bcrypt.hash('driver123', 10),
        role: 'driver'
      },
      {
        id: uuidv4(),
        name: 'Jane Coordinator',
        email: 'coordinator@campus.edu',
        password: await bcrypt.hash('coord123', 10),
        role: 'coordinator'
      },
      {
        id: uuidv4(),
        name: 'Alice Student',
        email: 'student1@campus.edu',
        password: await bcrypt.hash('student123', 10),
        role: 'student'
      },
      {
        id: uuidv4(),
        name: 'Bob Student',
        email: 'student2@campus.edu',
        password: await bcrypt.hash('student123', 10),
        role: 'student'
      }
    ];

    // Create sample routes
    const routes = [
      {
        id: uuidv4(),
        name: 'Main Campus Loop',
        description: 'Circular route covering main campus areas',
        color: '#FF6B6B',
        stops: JSON.stringify(['Main Gate', 'Library', 'Sports Complex', 'Cafeteria']),
        frequency: 'Every 30 minutes',
        operatingHours: '7:00 AM - 10:00 PM',
        estimatedDuration: '45 minutes'
      },
      {
        id: uuidv4(),
        name: 'Hostel to Campus',
        description: 'Direct route from student hostels to campus',
        color: '#4ECDC4',
        stops: JSON.stringify(['Hostel A', 'Hostel B', 'Main Gate', 'Library']),
        frequency: 'Every 20 minutes',
        operatingHours: '6:00 AM - 11:00 PM',
        estimatedDuration: '30 minutes'
      },
      {
        id: uuidv4(),
        name: 'Express Campus Tour',
        description: 'Express route with limited stops',
        color: '#95E1D3',
        stops: JSON.stringify(['Main Gate', 'Engineering Block', 'Science Block']),
        frequency: 'Every 45 minutes',
        operatingHours: '8:00 AM - 6:00 PM',
        estimatedDuration: '25 minutes'
      }
    ];

    // Create sample shuttles
    const shuttles = [
      {
        id: uuidv4(),
        vehicleNumber: 'SH-001',
        model: 'Mercedes Sprinter',
        capacity: 30,
        status: 'available',
        lat: 3.0573,
        lng: 101.5484,
        routeId: routes[0].id
      },
      {
        id: uuidv4(),
        vehicleNumber: 'SH-002',
        model: 'Volvo Coach',
        capacity: 45,
        status: 'available',
        lat: 3.0580,
        lng: 101.5490,
        routeId: routes[1].id
      },
      {
        id: uuidv4(),
        vehicleNumber: 'SH-003',
        model: 'Hyundai County',
        capacity: 35,
        status: 'available',
        lat: 3.0565,
        lng: 101.5475,
        routeId: routes[2].id
      }
    ];

    // Insert users
    console.log('📝 Inserting users...');
    for (const user of users) {
      await runAsync(
        `INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
        [user.id, user.name, user.email, user.password, user.role]
      );
    }
    console.log(`✓ ${users.length} users created`);

    // Insert routes
    console.log('\n🛣️  Inserting routes...');
    for (const route of routes) {
      await runAsync(
        `INSERT INTO routes (id, name, description, color, stops, frequency, operatingHours, estimatedDuration) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [route.id, route.name, route.description, route.color, route.stops, route.frequency, route.operatingHours, route.estimatedDuration]
      );
    }
    console.log(`✓ ${routes.length} routes created`);

    // Insert shuttles
    console.log('\n🚌 Inserting shuttles...');
    for (const shuttle of shuttles) {
      await runAsync(
        `INSERT INTO shuttles (id, vehicleNumber, model, capacity, status, lat, lng, routeId) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [shuttle.id, shuttle.vehicleNumber, shuttle.model, shuttle.capacity, shuttle.status, shuttle.lat, shuttle.lng, shuttle.routeId]
      );
    }
    console.log(`✓ ${shuttles.length} shuttles created`);

    // Create schedules for next 7 days
    console.log('\n📅 Inserting schedules...');
    let scheduleCount = 0;
    const driverId = users.find(u => u.role === 'driver').id;

    for (const route of routes) {
      const shuttle = shuttles.find(s => s.routeId === route.id);
      for (let day = 0; day < 7; day++) {
        for (let time of ['08:00', '10:00', '14:00', '16:00']) {
          const scheduleId = uuidv4();
          const departureDate = new Date();
          departureDate.setDate(departureDate.getDate() + day);
          const [hours, minutes] = time.split(':');
          departureDate.setHours(parseInt(hours), parseInt(minutes), 0);

          await runAsync(
            `INSERT INTO schedules (id, routeId, shuttleId, driverId, departureTime, status) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [scheduleId, route.id, shuttle.id, driverId, departureDate.toISOString(), 'scheduled']
          );
          scheduleCount++;
        }
      }
    }
    console.log(`✓ ${scheduleCount} schedules created`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Sample Credentials:');
    console.log('  Admin:       admin@campus.edu / admin123');
    console.log('  Driver:      driver1@campus.edu / driver123');
    console.log('  Coordinator: coordinator@campus.edu / coord123');
    console.log('  Student:     student1@campus.edu / student123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    closeDatabase();
    process.exit(0);
  }
};

seedDatabase();
