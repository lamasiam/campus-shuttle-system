const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return response.json();
    },
    register: async (name, email, password, role) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      return response.json();
    },
    getUsers: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/users`);
      return response.json();
    }
  },

  // Student endpoints
  student: {
    getRoutes: async () => {
      const response = await fetch(`${API_BASE_URL}/student/routes`);
      return response.json();
    },
    getRouteDetails: async (routeId) => {
      const response = await fetch(`${API_BASE_URL}/student/routes/${routeId}`);
      return response.json();
    },
    createBooking: async (studentId, scheduleId, pickupStop, dropoffStop) => {
      const response = await fetch(`${API_BASE_URL}/student/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, scheduleId, pickupStop, dropoffStop })
      });
      return response.json();
    },
    getBookings: async (studentId) => {
      const response = await fetch(`${API_BASE_URL}/student/bookings/${studentId}`);
      return response.json();
    },
    cancelBooking: async (bookingId) => {
      const response = await fetch(`${API_BASE_URL}/student/bookings/${bookingId}/cancel`, {
        method: 'PUT'
      });
      return response.json();
    }
  },

  // Driver endpoints
  driver: {
    getSchedules: async (driverId) => {
      const response = await fetch(`${API_BASE_URL}/driver/schedules/${driverId}`);
      return response.json();
    },
    startTrip: async (scheduleId) => {
      const response = await fetch(`${API_BASE_URL}/driver/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId })
      });
      return response.json();
    },
    updateLocation: async (tripId, lat, lng) => {
      const response = await fetch(`${API_BASE_URL}/driver/trips/${tripId}/location`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng })
      });
      return response.json();
    },
    scanQR: async (qrCode) => {
      const response = await fetch(`${API_BASE_URL}/driver/scan-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode })
      });
      return response.json();
    }
  },

  // Coordinator endpoints
  coordinator: {
    getRoutes: async () => {
      const response = await fetch(`${API_BASE_URL}/coordinator/routes`);
      return response.json();
    },
    createRoute: async (routeData) => {
      const response = await fetch(`${API_BASE_URL}/coordinator/routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routeData)
      });
      return response.json();
    },
    updateRoute: async (routeId, routeData) => {
      const response = await fetch(`${API_BASE_URL}/coordinator/routes/${routeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(routeData)
      });
      return response.json();
    },
    getSchedules: async () => {
      const response = await fetch(`${API_BASE_URL}/coordinator/schedules`);
      return response.json();
    },
    createSchedule: async (scheduleData) => {
      const response = await fetch(`${API_BASE_URL}/coordinator/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData)
      });
      return response.json();
    },
    assignDriver: async (scheduleId, driverId) => {
      const response = await fetch(`${API_BASE_URL}/coordinator/schedules/${scheduleId}/driver`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId })
      });
      return response.json();
    }
  },

  // Admin endpoints
  admin: {
    getUsers: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/users`);
      return response.json();
    },
    createUser: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return response.json();
    },
    updateUserRole: async (userId, role) => {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      return response.json();
    },
    getShuttles: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/shuttles`);
      return response.json();
    },
    createShuttle: async (shuttleData) => {
      const response = await fetch(`${API_BASE_URL}/admin/shuttles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shuttleData)
      });
      return response.json();
    },
    getStats: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/stats`);
      return response.json();
    }
  },

  // Notifications endpoints
  notifications: {
    getNotifications: async (userId) => {
      const response = await fetch(`${API_BASE_URL}/notifications/${userId}`);
      return response.json();
    },
    getUnreadCount: async (userId) => {
      const response = await fetch(`${API_BASE_URL}/notifications/${userId}/unread`);
      return response.json();
    },
    markAsRead: async (notificationId) => {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      return response.json();
    },
    create: async (userId, title, message, type) => {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, message, type })
      });
      return response.json();
    }
  }
};

export default api;
