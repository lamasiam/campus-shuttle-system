import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Bus, Calendar, Bell, MapPin, Star, TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';

interface StudentDashboardProps {
  userName: string;
  upcomingBookings: number;
  unreadNotifications: number;
  onNavigate: (tab: string) => void;
}

export function StudentDashboard({
  userName,
  upcomingBookings,
  unreadNotifications,
  onNavigate,
}: StudentDashboardProps) {
  const quickStats = [
    {
      title: 'Upcoming Trips',
      value: upcomingBookings,
      icon: Calendar,
      color: 'text-blue-600',
      action: () => onNavigate('bookings'),
    },
    {
      title: 'Notifications',
      value: unreadNotifications,
      icon: Bell,
      color: 'text-orange-600',
      action: () => onNavigate('notifications'),
    },
    {
      title: 'Active Routes',
      value: 3,
      icon: MapPin,
      color: 'text-green-600',
      action: () => onNavigate('routes'),
    },
  ];

  const quickActions = [
    {
      title: 'Book a Shuttle',
      description: 'Reserve your seat on available routes',
      icon: Bus,
      action: () => onNavigate('routes'),
      color: 'bg-blue-500',
    },
    {
      title: 'Track Live',
      description: 'See real-time shuttle locations',
      icon: MapPin,
      action: () => onNavigate('map'),
      color: 'bg-green-500',
    },
    {
      title: 'Rate Service',
      description: 'Share your feedback',
      icon: Star,
      action: () => onNavigate('feedback'),
      color: 'bg-yellow-500',
    },
  ];

  const recentActivity = [
    { text: 'Booked North Campus Loop for tomorrow 9:00 AM', time: '1 hour ago' },
    { text: 'Completed trip on South Campus Express', time: '2 hours ago' },
    { text: 'Rated your last trip 5 stars', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {userName}!</CardTitle>
          <CardDescription className="text-blue-100">
            Your campus shuttle dashboard
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={stat.action}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
              onClick={action.action}
            >
              <CardHeader>
                <div
                  className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
