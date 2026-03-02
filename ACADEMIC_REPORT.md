# Campus Shuttle Management System - Academic Report

## 5 Implementation Details

### 5.1 Development Environment

The development of the Campus Shuttle Management System was conducted in a modern, JavaScript-centric environment. The following tools and configurations were utilized:

*   **Operating System**: Windows (primary development environment).
*   **Integrated Development Environment (IDE)**: Visual Studio Code (VS Code).
    *   *Extensions*: ESLint, Prettier, Tailwind CSS IntelliSense, ES7+ React/Redux/React-Native snippets.
*   **Programming Languages**:
    *   **Frontend**: TypeScript (TSX) - chosen for type safety and better developer experience.
    *   **Backend**: JavaScript (Node.js) - chosen for non-blocking I/O and shared language with frontend.
*   **Frameworks & Libraries**:
    *   **Frontend**: React v18 (UI Library), Vite (Build Tool), Tailwind CSS v4 (Styling), Lucide React (Icons), Sonner (Notifications).
    *   **Backend**: Express.js (Web Framework), SQLite3 (Database Driver).
    *   **Testing**: Vitest (Test Runner).

**Environment Setup Instructions:**

1.  **Node.js Installation**: Ensure Node.js (v18 or higher) is installed.
2.  **Repository Cloning**:
    ```bash
    git clone https://github.com/lamasiam/campus-shuttle-system.git
    cd campus-shuttle-system
    ```
3.  **Dependency Installation**:
    ```bash
    npm install
    ```
4.  **Database Initialization**:
    ```bash
    node server/db/init.js
    node server/db/seed.js
    ```
5.  **Running the Application**:
    ```bash
    npm run dev  # Starts both client (Vite) and server (Express) concurrently
    ```

### 5.2 Software Integration

The system follows a client-server architecture where the frontend and backend are developed as separate modules but integrated via a RESTful API.

**Integration Strategy:**
*   **API-First Approach**: The backend exposes endpoints (e.g., `/api/auth/login`, `/api/bookings`) that return JSON data.
*   **Frontend Consumption**: The React frontend uses the native `fetch` API (encapsulated in `src/services/api.js`) to consume these endpoints.
*   **Concurrent Execution**: The `concurrently` package is used to run both the Vite development server (port 5173/5174) and the Express backend (port 5000) simultaneously in a single terminal command.
*   **Direct API Base URL**: The frontend targets the backend at `http://localhost:5000/api` during local development.

**Key Integration Files:**

| File | Description |
| :--- | :--- |
| `src/main.tsx` | The entry point for the React application, mounting the root component to the DOM. |
| `src/app/App.tsx` | The main application component that orchestrates routing (via state) and renders sub-components (Dashboard, Login). |
| `server/index.js` | The entry point for the Express backend, configuring middleware (CORS, JSON parsing) and mounting API routes. |
| `server/routes/*.js` | Modular route files (auth.js, student.js, etc.) that handle specific business logic and database interactions. |
| `package.json` | Defines the project dependencies and scripts (like `npm run dev`) that tie the build and run processes together. |

### 5.3 Database

The database is implemented using **SQLite**, a serverless, self-contained SQL database engine. This choice allows for zero-configuration setup and easy portability (the database is a single file: `data/shuttle.db`).

**Database Implementation:**
*   **Connection**: Handled by `server/db/connection.js`. It uses the `sqlite3` driver to open a connection to the file-based database and exports helper functions (`runAsync`, `getAsync`, `allAsync`) to wrap callback-based operations in Promises for modern `async/await` usage.
*   **Initialization**: The `server/db/init.js` script creates the necessary tables if they do not exist.
*   **Configuration**: The database is configured with a `busyTimeout` of 5000ms to handle concurrent write attempts gracefully.

**Database Schema:**

The schema consists of 7 relational tables:

1.  **`users`**: Stores user credentials and roles.
    *   `id` (PK), `name`, `email`, `password`, `role` ('student', 'driver', 'coordinator', 'admin').
2.  **`routes`**: Defines shuttle routes.
    *   `id` (PK), `name`, `description`, `stops`, `color`, `frequency`, `operatingHours`, `estimatedDuration`.
3.  **`shuttles`**: Manages vehicle inventory.
    *   `id` (PK), `vehicleNumber`, `model`, `capacity`, `status`, `lat`, `lng`, `routeId` (FK).
4.  **`schedules`**: Timetables for drivers and shuttles.
    *   `id` (PK), `routeId` (FK), `driverId` (FK), `shuttleId` (FK), `departureTime`, `status`.
5.  **`bookings`**: Stores passenger reservations.
    *   `id` (PK), `studentId` (FK), `scheduleId` (FK), `qrCode`, `pickupStop`, `dropoffStop`, `status`.
6.  **`trips`**: Tracks active trips.
    *   `id` (PK), `scheduleId` (FK), `status`, `startTime`, `currentLat`, `currentLng`.
7.  **`notifications`**: Stores system alerts.
    *   `id` (PK), `userId` (FK), `title`, `message`, `type`, `isRead`, `createdAt`.

---

## 6 Testing

### 6.1 Testing Strategy

The testing strategy focuses on **Integration Testing** to ensure that the different modules (Authentication, Booking, Database) work together correctly.

*   **Approach**: We use **Vitest** as the test runner. The tests are designed to spin up a real database connection (using the actual SQLite file or an in-memory instance) and execute operations against it. This verifies that the API logic correctly interacts with the database schema.
*   **Scope**:
    *   **Authentication Flow**: Verifies user creation, password hashing (bcrypt), and login validation.
    *   **Booking Flow**: Verifies the entire lifecycle of a booking: creating a reservation, generating a unique QR code token, linking it to a student and schedule, boarding verification, and cancelling it.
    *   **Data Integrity**: Ensures foreign key constraints and unique constraints (like email or QR code uniqueness) are enforced.

### 6.2 Test Data

The testing suite uses dynamic test data generated during runtime to ensure isolation between tests.

*   **Tools Used**: `uuid` for generating unique IDs and random strings.
*   **Sample Data Sets**:
    *   **User**: `id: <uuid>`, `name: 'Test Student'`, `email: 'student-<uuid>@test.com'`, `password: 'hash'`, `role: 'student'`.
    *   **Schedule**: Fetched from the existing seeded database (e.g., "North Campus Loop" schedule).
    *   **Booking**: `id: <uuid>`, `qrCode: <uuid>`, `status: 'confirmed'`, `pickupStop: 0`, `dropoffStop: 2`.

### 6.3 Acceptance Testing

The following acceptance tests were conducted to verify the system's functionality against requirements.

**Module: Student Subsystem**

| Criteria | Fulfilled | Remarks | Date Tested | % Complete | Tested by | Verified by |
| :--- | :---: | :--- | :--- | :---: | :--- | :--- |
| **Login**: Student can log in with valid email/password. | Yes | Successful redirection to dashboard. | 2026-02-07 | 100% | Team Member A | Team Lead |
| **View Routes**: Available shuttle routes are displayed. | Yes | Routes load from DB with correct colors. | 2026-02-07 | 100% | Team Member A | Team Lead |
| **Book Seat**: Student can select date, time, and stops. | Yes | **Fixed**: Date picker now prevents past dates. | 2026-02-07 | 100% | Team Member A | Team Lead |
| **QR Code**: Valid QR code is generated upon booking. | Yes | **Fixed**: Uses `qrcode` lib for real generation. | 2026-02-07 | 100% | Team Member A | Team Lead |

**Module: Driver Subsystem**

| Criteria | Fulfilled | Remarks | Date Tested | % Complete | Tested by | Verified by |
| :--- | :---: | :--- | :--- | :---: | :--- | :--- |
| **Login**: Driver can log in and see assignments. | Yes | Assigned route appears on dashboard. | 2026-02-07 | 100% | Team Member B | Team Lead |
| **Scan QR**: Driver can validate a passenger's QR code. | Yes | Scanner UI simulates valid/invalid checks. | 2026-02-07 | 100% | Team Member B | Team Lead |
| **Scan QR**: Driver validates booking against the backend. | Yes | QR code value is verified through `/api/driver/scan-qr` and booking status updates to boarded. | 2026-02-09 | 100% | Team Member B | Team Lead |
| **Start Trip**: Driver can initiate a trip. | Yes | Trip status updates in system. | 2026-02-07 | 100% | Team Member B | Team Lead |

**Module: Coordinator/Admin Subsystem**

| Criteria | Fulfilled | Remarks | Date Tested | % Complete | Tested by | Verified by |
| :--- | :---: | :--- | :--- | :---: | :--- | :--- |
| **Dashboard**: Admin can see total bookings and active routes. | Yes | Charts render with correct data. | 2026-02-07 | 100% | Team Member C | Team Lead |
| **User Mgmt**: Admin can view system users. | Yes | User list populates from DB. | 2026-02-07 | 100% | Team Member C | Team Lead |

**Automated Test Results (Vitest):**

```
✓ server/tests/booking.test.js (6)
  - should create a booking
  - should retrieve student bookings
  - should mark a booking as boarded
  - should cancel a booking
  - should get booking with route details
  - should validate QR code uniqueness

✓ server/tests/auth.test.js (5)
  - should create a new user
  - should verify password correctly
  - should reject invalid password
  - should get all users
  - should find user by email

Test Files  2 passed (2)
Tests       11 passed (11)
```
