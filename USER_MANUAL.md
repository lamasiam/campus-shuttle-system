# Campus Shuttle Management System - User Manual

## 1. Introduction
Welcome to the Campus Shuttle Management System. This document provides step-by-step instructions for using the web application to book rides, manage schedules, and track shuttle services.

## 2. Getting Started

### 2.1 Launching the Application
1. Ensure the system is running (refer to `README.txt` for setup).
2. Open your web browser and navigate to the local address shown in the terminal (e.g., `http://localhost:5173`).
3. You will be presented with the **Login Screen**.

---

## 3. Student Module

### 3.1 Logging In
1. Select the **Login** tab on the home screen.
2. Enter a student email (e.g., `student1@campus.edu`).
3. Enter the matching password (e.g., `student123`).
4. Click **Sign In**.

### 3.2 Dashboard Overview
Upon login, you will see the **Student Dashboard**:
*   **Quick Stats**: Shows upcoming trips and notifications.
*   **Quick Actions**: Buttons for "Book a Ride", "Live Tracking", and "Feedback".
*   **Recent Activity**: A timeline of your latest interactions.

### 3.3 Booking a Seat
1. Click the **Book a Ride** button (Bus icon).
2. The **Booking Dialog** will appear.
3. **Select Date**: Choose a date from the calendar (must be today or in the future).
4. **Select Time**: Choose your preferred departure time.
5. **Select Stops**: Choose your **Pickup** and **Dropoff** locations.
6. Click **Confirm Booking** at the bottom of the dialog.
7. A success message will appear, and a notification will be generated.

### 3.4 Generating a QR Ticket
1. After booking, a "View QR" button or notification will appear.
2. Navigate to **Upcoming Trips** or click the booking in your history.
3. Click **View Ticket**.
4. A **QR Code** will be displayed. Show this to the driver when boarding.
5. The ticket code is also shown under the QR image for manual verification if needed.

---

## 4. Driver Module

### 4.1 Driver Login
1. Log in with a driver email (e.g., `driver1@campus.edu`) and password (e.g., `driver123`).
2. You will be directed to the **Driver Dashboard**.

### 4.2 Viewing Schedule
*   The dashboard displays your **Current Route** and **Next Stop**.
*   A list of scheduled trips for the day is visible in the "Today's Schedule" section.

### 4.3 Scanning Tickets
1. Click the **Scan QR** button.
2. The scanner interface will open.
3. Allow camera permission when prompted.
4. Point the camera at the passenger's QR code until it is detected.
5. If the device does not support camera scanning, use the manual input field to paste/enter the QR code value shown under the ticket.
6. If the ticket is valid, a **Verified** confirmation appears and the passenger can board.
7. Click **Done** to return to the dashboard.

---

## 5. Coordinator/Admin Module

### 5.1 Admin Login
1. Log in with an admin email (e.g., `admin@campus.edu`).
2. Access the **Coordinator Dashboard**.

### 5.2 System Monitoring
*   **Total Bookings**: View the total number of reservations.
*   **Active Routes**: Monitor which routes are currently operational.
*   **Incident Reports**: View and manage reported issues (delays, maintenance).

### 5.3 Managing Routes
1. Navigate to the **Route Management** tab (if available in your version).
2. View the list of active routes (North Campus, South Campus, etc.).
3. Monitor average wait times and passenger volume charts.

---

## 6. Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Login Failed** | Ensure you are using one of the test accounts in `README.txt` and the correct password. |
| **Date Selection Disabled** | You cannot select past dates. Ensure you pick today or a future date. |
| **QR Code Not Showing** | Ensure the booking was confirmed successfully and the page has finished loading. |
| **Map Not Loading** | The map uses simulated data; ensure JavaScript is enabled in your browser. |

---

**Support**: For further assistance, please contact the IT Helpdesk.
