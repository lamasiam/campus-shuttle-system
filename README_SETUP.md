# Campus Shuttle Management System - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- npm v9+

### Installation & Setup

1. **Install Dependencies**
```bash
npm install --legacy-peer-deps
```

2. **Initialize Database**
```bash
npm run db:init
```

3. **Seed Sample Data**
```bash
npm run db:seed
```

4. **Start Development Servers**
```bash
# Terminal 1 - Backend (Port 5000)
PORT=5000 node server/index.js

# Terminal 2 - Frontend (Port 5173)
npm run dev:client
```

5. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

---

## 📊 Database

### SQLite Database
- **Location:** `/data/shuttle.db`
- **Tables:** 8 (Users, Routes, Shuttles, Schedules, Bookings, Trips, Incidents, Notifications)

### Sample Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campus.edu | admin123 |
| Driver | driver1@campus.edu | driver123 |
| Coordinator | coordinator@campus.edu | coord123 |
| Student | student1@campus.edu | student123 |

---

## 🏗️ Project Structure

```
shuttle-system/
├── server/
│   ├── index.js                 # Express server entry point
│   ├── db/
│   │   ├── init.js             # Database initialization
│   │   ├── seed.js             # Sample data seeding
│   │   └── connection.js       # Database connection module
│   ├── routes/
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── student.js          # Student API routes
│   │   ├── driver.js           # Driver API routes
│   │   ├── coordinator.js      # Coordinator API routes
│   │   ├── admin.js            # Admin API routes
│   │   └── notifications.js    # Notification endpoints
│   └── tests/
│       ├── auth.test.js        # Authentication tests
│       └── booking.test.js     # Booking system tests
├── src/
│   ├── app/
│   │   ├── App.tsx             # Main React component
│   │   ├── components/         # UI components
│   │   └── pages/              # Page components
│   ├── services/
│   │   └── api.js              # API client module
│   ├── index.css               # Global styles with gradients
│   └── main.tsx                # React entry point
├── data/
│   └── shuttle.db              # SQLite database
├── package.json                # Dependencies
├── vite.config.ts              # Vite configuration
└── vitest.config.js            # Test configuration
```

---

## 🎨 Design System

### Color Gradients
- **Primary:** Blue to Purple (`#667eea` → `#764ba2`)
- **Secondary:** Cyan to Blue (`#00d4ff` → `#0099ff`)
- **Accent:** Orange to Pink (`#ff6b6b` → `#ff8e53`)
- **Warm:** Yellow to Orange (`#ffa751` → `#ffe259`)
- **Cool:** Teal to Cyan (`#00b4db` → `#0083b0`)

### Typography
- **Headers:** Poppins (Bold, 700)
- **Body:** Inter (Regular, 400)
- **Font Sizes:** Responsive with mobile optimization

### Components
- Gradient buttons with hover effects
- Card components with shadows
- Form inputs with focus states
- Badges for status indicators
- Alerts for notifications

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login           - User login
POST   /api/auth/register        - User registration
GET    /api/auth/users           - Get all users
```

### Student
```
GET    /api/student/routes       - List all routes
GET    /api/student/routes/:id   - Get route details
POST   /api/student/bookings     - Create booking
GET    /api/student/bookings/:id - Get student bookings
PUT    /api/student/bookings/:id/cancel - Cancel booking
```

### Driver
```
GET    /api/driver/schedules/:id - Get driver schedules
POST   /api/driver/trips         - Start trip
PUT    /api/driver/trips/:id/location - Update location
POST   /api/driver/scan-qr       - Scan QR code
```

### Coordinator
```
GET    /api/coordinator/routes   - Get all routes
POST   /api/coordinator/routes   - Create route
PUT    /api/coordinator/routes/:id - Update route
GET    /api/coordinator/schedules - Get all schedules
POST   /api/coordinator/schedules - Create schedule
PUT    /api/coordinator/schedules/:id/driver - Assign driver
```

### Admin
```
GET    /api/admin/users          - Get all users
POST   /api/admin/users          - Create user
PUT    /api/admin/users/:id/role - Update user role
GET    /api/admin/shuttles       - Get all shuttles
POST   /api/admin/shuttles       - Create shuttle
GET    /api/admin/stats          - Get system statistics
```

### Notifications
```
GET    /api/notifications/:userId - Get user notifications
GET    /api/notifications/:userId/unread - Get unread count
PUT    /api/notifications/:id/read - Mark as read
POST   /api/notifications        - Create notification
```

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Test Files
- `server/tests/auth.test.js` - Authentication system tests
- `server/tests/booking.test.js` - Booking flow tests

### Test Coverage
- User authentication and password validation
- Booking creation and cancellation
- QR code uniqueness
- Route and schedule management
- Notification system

---

## 🎯 Features

### ✅ Implemented
- [x] Multi-role authentication (Student, Driver, Coordinator, Admin)
- [x] SQLite database with 8 tables
- [x] Student booking with QR code generation
- [x] Driver schedule management
- [x] Route and schedule creation
- [x] Admin user and shuttle management
- [x] Notification system
- [x] Color gradient design system
- [x] Comprehensive API endpoints
- [x] Unit and integration tests
- [x] Sample data seeding

### 🚧 In Progress
- [ ] Frontend integration with backend API
- [ ] Real-time location tracking
- [ ] Advanced analytics dashboard

### 📋 Future Enhancements
- [ ] WebSocket for real-time updates
- [ ] Email notifications
- [ ] Mobile app
- [ ] Advanced reporting
- [ ] Payment integration

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 node server/index.js
```

### Database Issues
```bash
# Reinitialize database
rm data/shuttle.db
npm run db:init
npm run db:seed
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 📝 Environment Variables

Create `.env` file in root directory:
```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./data/shuttle.db
```

---

## 🔐 Security Notes

- Passwords are hashed with bcryptjs
- QR codes are unique per booking
- Role-based access control implemented
- API endpoints validate input data
- CORS enabled for local development

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API endpoint documentation
3. Check test files for usage examples
4. Review database schema in `server/db/init.js`

---

## 📄 License

Campus Shuttle Management System - Educational Project

---

**Last Updated:** February 6, 2026
**Version:** 1.0.0
