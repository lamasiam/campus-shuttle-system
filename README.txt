Campus Shuttle Management System
================================

This folder contains the complete source code and resources for the Campus Shuttle Management System.

System Requirements
-------------------
1. Node.js (v18.0.0 or higher)
2. npm (Node Package Manager)
3. Modern Web Browser (Chrome, Edge, Firefox)

Installation & Setup
--------------------
1. Open a terminal/command prompt in this folder.
2. Install dependencies:
   npm install
3. Initialize the database (optional if `data/shuttle.db` already exists):
   node server/db/init.js
   node server/db/seed.js
4. Start the application:
   npm run dev

The application will launch in your default browser at a local address shown in the terminal output (for example: http://localhost:5173).

Login Credentials (Test Accounts)
---------------------------------
Use the following credentials to test different user roles.

1. Student Role
   Email: student1@campus.edu
   Password: student123
   Role Capabilities: Book seats, View routes, View booking QR ticket.

2. Driver Role
   Email: driver1@campus.edu
   Password: driver123
   Role Capabilities: View assigned schedule, Scan/Verify QR codes.

3. Coordinator Role
   Email: coordinator@campus.edu
   Password: coord123
   Role Capabilities: Manage routes, View system status.

4. Administrator Role
   Email: admin@campus.edu
   Password: admin123
   Role Capabilities: Full system access, User management.

Troubleshooting
---------------
- If the browser does not open automatically, check the terminal output for the correct URL (Local: http://localhost:...).
- If you encounter database errors, ensure the 'data' folder exists and has write permissions.
- For "Address already in use" errors, restart the terminal or kill the node process.

Technology Stack
----------------
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: SQLite
