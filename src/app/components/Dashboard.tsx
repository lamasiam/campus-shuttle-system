import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface DashboardProps {
  bookings: Array<{ routeId: string; date: Date }>;
  incidents: Array<{ status: string; priority: string }>;
  routes: Array<{ id: string; name: string }>;
}

export function Dashboard({ bookings, incidents, routes }: DashboardProps) {
  // Calculate statistics
  const totalBookings = bookings.length;
  const openIncidents = incidents.filter((i) => i.status === 'open').length;
  const resolvedIncidents = incidents.filter((i) => i.status === 'resolved').length;
  const avgBookingsPerRoute = totalBookings / routes.length;

  // Bookings by route
  const bookingsByRoute = routes.map((route) => ({
    name: route.name.split(' ')[0], // Shortened name for chart
    bookings: bookings.filter((b) => b.routeId === route.id).length,
  }));

  // Bookings trend (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const bookingsTrend = last7Days.map((date) => ({
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    bookings: bookings.filter((b) => {
      const bookingDate = new Date(b.date);
      return bookingDate.toDateString() === date.toDateString();
    }).length,
  }));

  // Incident status distribution
  const incidentStatus = [
    { name: 'Open', value: incidents.filter((i) => i.status === 'open').length, color: '#ef4444' },
    {
      name: 'In Progress',
      value: incidents.filter((i) => i.status === 'in-progress').length,
      color: '#f59e0b',
    },
    {
      name: 'Resolved',
      value: incidents.filter((i) => i.status === 'resolved').length,
      color: '#10b981',
    },
  ].filter((item) => item.value > 0);

  // Route efficiency (mock data based on bookings)
  const routeEfficiency = routes.map((route) => {
    const routeBookings = bookings.filter((b) => b.routeId === route.id).length;
    const efficiency = Math.min(100, (routeBookings / 10) * 100); // Mock calculation
    return {
      name: route.name.split(' ')[0],
      efficiency: Math.round(efficiency),
      capacity: 100,
    };
  });

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {avgBookingsPerRoute.toFixed(1)} avg per route
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routes.length}</div>
            <p className="text-xs text-muted-foreground">All operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openIncidents}</div>
            <p className="text-xs text-muted-foreground">
              {resolvedIncidents} resolved today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12m</div>
            <p className="text-xs text-muted-foreground">-3m from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Route */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings by Route</CardTitle>
            <CardDescription>Total bookings per shuttle route</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingsByRoute}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bookings Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Trend</CardTitle>
            <CardDescription>Daily bookings over the last week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Incident Status */}
        <Card>
          <CardHeader>
            <CardTitle>Incident Status</CardTitle>
            <CardDescription>Distribution of incident statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incidentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incidentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Route Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle>Route Efficiency</CardTitle>
            <CardDescription>Capacity utilization by route</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routeEfficiency} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="efficiency" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
