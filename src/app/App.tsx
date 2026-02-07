import React, { useState, useEffect } from 'react';
import { AuthForm } from './components/AuthForm';
import { StudentDashboard } from './components/StudentDashboard';
import { DriverDashboard } from './components/DriverDashboard';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { ShuttleMap } from './components/ShuttleMap';
import { RouteSchedule } from './components/RouteSchedule';
import { RouteManagement } from './components/RouteManagement';
import { DriverAssignment } from './components/DriverAssignment';
import { BookingDialog } from './components/BookingDialog';
import { IncidentReport } from './components/IncidentReport';
import { Dashboard } from './components/Dashboard';
import { NotificationCenter } from './components/NotificationCenter';
import { MyBookings } from './components/MyBookings';
import { FeedbackForm } from './components/FeedbackForm';
import { QRScanner } from './components/QRScanner';
import { QRCodeDisplay } from './components/QRCodeDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { LogOut, Bus } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'driver' | 'coordinator';
}

interface Route {
  id: string;
  name: string;
  color: string;
  stops: string[];
  frequency: string;
  operatingHours: string;
  estimatedDuration: string;
}

interface Shuttle {
  id: string;
  routeId: string;
  lat: number;
  lng: number;
  status: string;
  occupancy: number;
}

interface Booking {
  id: string;
  userId: string;
  routeId: string;
  routeName: string;
  date: Date;
  time: string;
  pickupStop: string;
  dropoffStop: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

interface Incident {
  id: string;
  type: string;
  routeId: string;
  routeName: string;
  description: string;
  reportedBy: string;
  timestamp: Date;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
}

interface Notification {
  id: string;
  type: 'arrival' | 'delay' | 'route-change' | 'booking-confirmation';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface Driver {
  id: string;
  name: string;
  status: 'available' | 'on-duty' | 'off-duty';
  currentRoute?: string;
}

interface Assignment {
  id: string;
  driverId: string;
  driverName: string;
  routeId: string;
  routeName: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface Feedback {
  id: string;
  userId: string;
  routeName: string;
  rating: number;
  category: string;
  comment: string;
  date: Date;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [qrScannerOpen, setQRScannerOpen] = useState(false);
  const [qrDisplayOpen, setQRDisplayOpen] = useState(false);
  const [selectedBookingForQR, setSelectedBookingForQR] = useState<Booking | null>(null);
  const [selectedRouteForBooking, setSelectedRouteForBooking] = useState<Route | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [tripActive, setTripActive] = useState(false);
  const [currentStop, setCurrentStop] = useState(0);

  const [routes, setRoutes] = useState<Route[]>([
    {
      id: 'route-1',
      name: 'North Campus Loop',
      color: '#3b82f6',
      stops: ['Main Library', 'Science Building', 'Student Union', 'North Dorms'],
      frequency: 'Every 15 min',
      operatingHours: '7 AM - 10 PM',
      estimatedDuration: '25 min',
    },
    {
      id: 'route-2',
      name: 'South Campus Express',
      color: '#10b981',
      stops: ['Main Gate', 'Engineering Hall', 'Arts Center', 'Sports Complex'],
      frequency: 'Every 20 min',
      operatingHours: '7 AM - 9 PM',
      estimatedDuration: '30 min',
    },
    {
      id: 'route-3',
      name: 'Downtown Connector',
      color: '#f59e0b',
      stops: ['Campus Center', 'Medical School', 'Law Building', 'Downtown Station'],
      frequency: 'Every 30 min',
      operatingHours: '6 AM - 11 PM',
      estimatedDuration: '40 min',
    },
  ]);

  const [shuttles] = useState<Shuttle[]>([
    {
      id: 'shuttle-1',
      routeId: 'route-1',
      lat: 40.7589,
      lng: -73.9851,
      status: 'On Time',
      occupancy: 65,
    },
    {
      id: 'shuttle-2',
      routeId: 'route-2',
      lat: 40.7549,
      lng: -73.9871,
      status: 'On Time',
      occupancy: 45,
    },
    {
      id: 'shuttle-3',
      routeId: 'route-3',
      lat: 40.7629,
      lng: -73.9851,
      status: 'Delayed',
      occupancy: 80,
    },
    {
      id: 'shuttle-4',
      routeId: 'route-1',
      lat: 40.7629,
      lng: -73.9811,
      status: 'On Time',
      occupancy: 50,
    },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'booking-1',
      userId: '1',
      routeId: 'route-1',
      routeName: 'North Campus Loop',
      date: new Date(Date.now() + 86400000),
      time: '09:00 AM',
      pickupStop: 'Main Library',
      dropoffStop: 'Student Union',
      status: 'confirmed',
    },
    {
      id: 'booking-2',
      userId: '1',
      routeId: 'route-2',
      routeName: 'South Campus Express',
      date: new Date(Date.now() - 86400000),
      time: '02:00 PM',
      pickupStop: 'Main Gate',
      dropoffStop: 'Sports Complex',
      status: 'completed',
    },
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'incident-1',
      type: 'delay',
      routeId: 'route-3',
      routeName: 'Downtown Connector',
      description: 'Traffic congestion on Main Street causing 10-minute delay',
      reportedBy: 'System',
      timestamp: new Date(Date.now() - 1800000),
      status: 'in-progress',
      priority: 'medium',
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      type: 'booking-confirmation',
      title: 'Booking Confirmed',
      message: 'Your seat on North Campus Loop for tomorrow at 9:00 AM is confirmed',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      priority: 'medium',
    },
  ]);

  const [drivers, setDrivers] = useState<Driver[]>([
    { id: 'driver-1', name: 'John Smith', status: 'on-duty', currentRoute: 'North Campus Loop' },
    { id: 'driver-2', name: 'Sarah Johnson', status: 'on-duty', currentRoute: 'South Campus Express' },
    { id: 'driver-3', name: 'Mike Davis', status: 'available' },
    { id: 'driver-4', name: 'Emily Brown', status: 'off-duty' },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'assign-1',
      driverId: 'driver-1',
      driverName: 'John Smith',
      routeId: 'route-1',
      routeName: 'North Campus Loop',
      date: new Date(),
      startTime: '07:00',
      endTime: '15:00',
    },
  ]);

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // Get driver assignment for current user
  const driverAssignment = user?.role === 'driver' 
    ? assignments.find(a => a.driverName === user.name && new Date(a.date).toDateString() === new Date().toDateString())
    : null;

  const assignedRouteForDriver = driverAssignment 
    ? routes.find(r => r.id === driverAssignment.routeId) 
      ? {
          id: driverAssignment.routeId,
          name: driverAssignment.routeName,
          startTime: driverAssignment.startTime,
          endTime: driverAssignment.endTime,
          stops: routes.find(r => r.id === driverAssignment.routeId)?.stops || [],
        }
      : null
    : null;

  const handleLogin = (userData: User) => {
    setUser(userData);
    toast.success(`Welcome, ${userData.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedRoute(null);
    setCurrentTab('dashboard');
    toast.info('Logged out successfully');
  };

  const handleSelectRoute = (routeId: string) => {
    setSelectedRoute(selectedRoute === routeId ? null : routeId);
  };

  const handleBookSeat = (routeId: string) => {
    const route = routes.find((r) => r.id === routeId);
    if (route) {
      setSelectedRouteForBooking(route);
      setBookingDialogOpen(true);
    }
  };

  const handleConfirmBooking = (bookingData: {
    routeId: string;
    date: Date;
    time: string;
    pickupStop: string;
    dropoffStop: string;
  }) => {
    const route = routes.find((r) => r.id === bookingData.routeId);
    if (!route || !user) return;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      userId: user.id,
      routeId: bookingData.routeId,
      routeName: route.name,
      date: bookingData.date,
      time: bookingData.time,
      pickupStop: bookingData.pickupStop,
      dropoffStop: bookingData.dropoffStop,
      status: 'confirmed',
    };

    setBookings([...bookings, newBooking]);

    // Show QR code
    setSelectedBookingForQR(newBooking);
    setQRDisplayOpen(true);

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'booking-confirmation',
      title: 'Booking Confirmed',
      message: `Your seat on ${route.name} for ${bookingData.date.toLocaleDateString()} at ${
        bookingData.time
      } is confirmed`,
      timestamp: new Date(),
      read: false,
      priority: 'medium',
    };

    if (notificationsEnabled) {
      setNotifications([newNotification, ...notifications]);
      toast.success('Booking confirmed! Your QR code is ready.');
    } else {
      toast.success('Booking confirmed!');
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(
      bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
    toast.info('Booking cancelled');
  };

  const handleSubmitIncident = (incidentData: Omit<Incident, 'id' | 'timestamp' | 'status'>) => {
    const newIncident: Incident = {
      ...incidentData,
      id: `incident-${Date.now()}`,
      timestamp: new Date(),
      status: 'open',
    };

    setIncidents([newIncident, ...incidents]);
    toast.success('Incident reported successfully');
  };

  const handleUpdateIncidentStatus = (
    id: string,
    status: 'open' | 'in-progress' | 'resolved'
  ) => {
    setIncidents(incidents.map((i) => (i.id === id ? { ...i, status } : i)));
    toast.success(`Incident marked as ${status}`);
  };

  const handleCreateRoute = (routeData: Omit<Route, 'id'>) => {
    const newRoute: Route = {
      ...routeData,
      id: `route-${Date.now()}`,
    };
    setRoutes([...routes, newRoute]);
    toast.success('Route created successfully');
  };

  const handleEditRoute = (id: string, routeData: Partial<Route>) => {
    setRoutes(routes.map((r) => (r.id === id ? { ...r, ...routeData } : r)));
    toast.success('Route updated successfully');
  };

  const handleDeleteRoute = (id: string) => {
    setRoutes(routes.filter((r) => r.id !== id));
    toast.success('Route deleted successfully');
  };

  const handleAssignDriver = (assignmentData: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assign-${Date.now()}`,
    };
    setAssignments([...assignments, newAssignment]);
    
    // Update driver status
    setDrivers(drivers.map(d => 
      d.id === assignmentData.driverId 
        ? { ...d, status: 'on-duty' as const, currentRoute: assignmentData.routeName }
        : d
    ));
    
    toast.success('Driver assigned successfully');
  };

  const handleUnassignDriver = (id: string) => {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
      setDrivers(drivers.map(d => 
        d.id === assignment.driverId 
          ? { ...d, status: 'available' as const, currentRoute: undefined }
          : d
      ));
    }
    setAssignments(assignments.filter((a) => a.id !== id));
    toast.success('Assignment removed');
  };

  const handleSubmitFeedback = (feedbackData: Omit<Feedback, 'id' | 'date' | 'userId'>) => {
    if (!user) return;
    const newFeedback: Feedback = {
      ...feedbackData,
      id: `feedback-${Date.now()}`,
      userId: user.id,
      date: new Date(),
    };
    setFeedbacks([newFeedback, ...feedbacks]);
    toast.success('Thank you for your feedback!');
  };

  const handleStartTrip = () => {
    setTripActive(true);
    setCurrentStop(0);
    toast.success('Trip started');
  };

  const handleEndTrip = () => {
    setTripActive(false);
    setCurrentStop(0);
    toast.success('Trip ended');
  };

  const handleUpdateStop = (stop: string, status: 'arrived' | 'departed') => {
    if (status === 'departed') {
      setCurrentStop(prev => prev + 1);
    }
    toast.info(`${status === 'arrived' ? 'Arrived at' : 'Departed from'} ${stop}`);
  };

  const handleScanQR = (bookingId: string) => {
    toast.success('Passenger verified');
  };

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  const userBookings = bookings.filter((b) => b.userId === user.id);
  const userFeedbacks = feedbacks.filter((f) => f.userId === user.id);
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const upcomingBookings = userBookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.date) >= new Date()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bus size={32} className="text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Campus Shuttle System</h1>
                <p className="text-sm text-gray-600">Real-time tracking & booking</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Interface */}
        {user.role === 'student' && (
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="notifications">
                Notifications
                {unreadNotifications > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <StudentDashboard
                userName={user.name.split(' ')[0]}
                upcomingBookings={upcomingBookings}
                unreadNotifications={unreadNotifications}
                onNavigate={setCurrentTab}
              />
            </TabsContent>

            <TabsContent value="map">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ShuttleMap selectedRoute={selectedRoute} shuttles={shuttles} />
                </div>
                <div>
                  <RouteSchedule
                    routes={routes}
                    onSelectRoute={handleSelectRoute}
                    selectedRoute={selectedRoute}
                    onBookSeat={handleBookSeat}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="routes">
              <RouteSchedule
                routes={routes}
                onSelectRoute={handleSelectRoute}
                selectedRoute={selectedRoute}
                onBookSeat={handleBookSeat}
              />
            </TabsContent>

            <TabsContent value="bookings">
              <MyBookings bookings={userBookings} onCancelBooking={handleCancelBooking} />
            </TabsContent>

            <TabsContent value="incidents">
              <IncidentReport
                routes={routes.map((r) => ({ id: r.id, name: r.name }))}
                onSubmitIncident={handleSubmitIncident}
                incidents={incidents}
                onUpdateStatus={handleUpdateIncidentStatus}
                userRole={user.role}
              />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationCenter
                notifications={notifications}
                onMarkRead={(id) =>
                  setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
                }
                onMarkAllRead={() =>
                  setNotifications(notifications.map((n) => ({ ...n, read: true })))
                }
                onDelete={(id) => setNotifications(notifications.filter((n) => n.id !== id))}
                notificationsEnabled={notificationsEnabled}
                onToggleNotifications={setNotificationsEnabled}
              />
            </TabsContent>

            <TabsContent value="feedback">
              <FeedbackForm
                routes={routes}
                onSubmit={handleSubmitFeedback}
                feedbackHistory={userFeedbacks}
              />
            </TabsContent>
          </Tabs>
        )}

        {/* Driver Interface */}
        {user.role === 'driver' && (
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="incidents">Report Incident</TabsTrigger>
              <TabsTrigger value="map">Live Map</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DriverDashboard
                driverName={user.name}
                assignedRoute={assignedRouteForDriver}
                onStartTrip={handleStartTrip}
                onEndTrip={handleEndTrip}
                onUpdateStop={handleUpdateStop}
                onScanQR={() => setQRScannerOpen(true)}
                onReportIncident={() => setCurrentTab('incidents')}
                tripActive={tripActive}
                currentStop={currentStop}
              />
            </TabsContent>

            <TabsContent value="incidents">
              <IncidentReport
                routes={routes.map((r) => ({ id: r.id, name: r.name }))}
                onSubmitIncident={handleSubmitIncident}
                incidents={incidents}
                onUpdateStatus={handleUpdateIncidentStatus}
                userRole={user.role}
              />
            </TabsContent>

            <TabsContent value="map">
              <ShuttleMap selectedRoute={selectedRoute} shuttles={shuttles} />
            </TabsContent>
          </Tabs>
        )}

        {/* Transport Coordinator Interface */}
        {user.role === 'coordinator' && (
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="monitoring">Live Monitor</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <CoordinatorDashboard onNavigate={setCurrentTab} />
            </TabsContent>

            <TabsContent value="routes">
              <RouteManagement
                routes={routes}
                onCreateRoute={handleCreateRoute}
                onEditRoute={handleEditRoute}
                onDeleteRoute={handleDeleteRoute}
              />
            </TabsContent>

            <TabsContent value="drivers">
              <DriverAssignment
                drivers={drivers}
                routes={routes}
                assignments={assignments}
                onAssign={handleAssignDriver}
                onUnassign={handleUnassignDriver}
              />
            </TabsContent>

            <TabsContent value="monitoring">
              <ShuttleMap selectedRoute={selectedRoute} shuttles={shuttles} />
            </TabsContent>

            <TabsContent value="incidents">
              <IncidentReport
                routes={routes.map((r) => ({ id: r.id, name: r.name }))}
                onSubmitIncident={handleSubmitIncident}
                incidents={incidents}
                onUpdateStatus={handleUpdateIncidentStatus}
                userRole="admin"
              />
            </TabsContent>

            <TabsContent value="analytics">
              <Dashboard bookings={bookings} incidents={incidents} routes={routes} />
            </TabsContent>
          </Tabs>
        )}

        {/* Admin Interface */}
        {user.role === 'admin' && (
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="monitoring">Monitor</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <Dashboard bookings={bookings} incidents={incidents} routes={routes} />
            </TabsContent>

            <TabsContent value="routes">
              <RouteManagement
                routes={routes}
                onCreateRoute={handleCreateRoute}
                onEditRoute={handleEditRoute}
                onDeleteRoute={handleDeleteRoute}
              />
            </TabsContent>

            <TabsContent value="drivers">
              <DriverAssignment
                drivers={drivers}
                routes={routes}
                assignments={assignments}
                onAssign={handleAssignDriver}
                onUnassign={handleUnassignDriver}
              />
            </TabsContent>

            <TabsContent value="incidents">
              <IncidentReport
                routes={routes.map((r) => ({ id: r.id, name: r.name }))}
                onSubmitIncident={handleSubmitIncident}
                incidents={incidents}
                onUpdateStatus={handleUpdateIncidentStatus}
                userRole={user.role}
              />
            </TabsContent>

            <TabsContent value="monitoring">
              <ShuttleMap selectedRoute={selectedRoute} shuttles={shuttles} />
            </TabsContent>

            <TabsContent value="analytics">
              <Dashboard bookings={bookings} incidents={incidents} routes={routes} />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Dialogs */}
      <BookingDialog
        open={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        route={selectedRouteForBooking}
        onBook={handleConfirmBooking}
      />

      <QRScanner
        open={qrScannerOpen}
        onClose={() => setQRScannerOpen(false)}
        onScan={handleScanQR}
      />

      <QRCodeDisplay
        open={qrDisplayOpen}
        onClose={() => setQRDisplayOpen(false)}
        booking={selectedBookingForQR}
      />
    </div>
  );
}
