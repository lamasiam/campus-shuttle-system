import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Bus, Users, Route, Calendar, AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface CoordinatorDashboardProps {
  onNavigate: (tab: string) => void;
}

export function CoordinatorDashboard({ onNavigate }: CoordinatorDashboardProps) {
  const stats = [
    {
      title: 'Active Routes',
      value: '3',
      change: '+1 this week',
      icon: Route,
      color: 'text-blue-600',
    },
    {
      title: 'Active Drivers',
      value: '12',
      change: '10 on duty now',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Total Trips Today',
      value: '48',
      change: '+12% from yesterday',
      icon: Bus,
      color: 'text-purple-600',
    },
    {
      title: 'Open Incidents',
      value: '2',
      change: '5 resolved today',
      icon: AlertTriangle,
      color: 'text-orange-600',
    },
  ];

  const quickActions = [
    {
      title: 'Create Route',
      description: 'Add a new shuttle route',
      icon: Route,
      action: () => onNavigate('routes'),
      color: 'bg-blue-500',
    },
    {
      title: 'Assign Driver',
      description: 'Schedule driver shifts',
      icon: Users,
      action: () => onNavigate('drivers'),
      color: 'bg-green-500',
    },
    {
      title: 'Live Monitoring',
      description: 'Track active shuttles',
      icon: Bus,
      action: () => onNavigate('monitoring'),
      color: 'bg-purple-500',
    },
    {
      title: 'View Reports',
      description: 'Analytics and insights',
      icon: TrendingUp,
      action: () => onNavigate('analytics'),
      color: 'bg-orange-500',
    },
  ];

  const recentActivities = [
    {
      type: 'route',
      text: 'New route "Evening Express" created',
      time: '10 minutes ago',
      icon: Route,
    },
    {
      type: 'driver',
      text: 'Driver John Smith assigned to North Campus Loop',
      time: '1 hour ago',
      icon: Users,
    },
    {
      type: 'incident',
      text: 'Incident on Downtown Connector resolved',
      time: '2 hours ago',
      icon: CheckCircle,
    },
    {
      type: 'schedule',
      text: 'Weekend schedule updated',
      time: '3 hours ago',
      icon: Calendar,
    },
  ];

  const activeTrips = [
    { driver: 'John Smith', route: 'North Campus Loop', progress: 65, eta: '15 min' },
    { driver: 'Sarah Johnson', route: 'South Campus Express', progress: 40, eta: '25 min' },
    { driver: 'Mike Davis', route: 'Downtown Connector', progress: 80, eta: '8 min' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Transport Coordinator Dashboard</CardTitle>
          <CardDescription className="text-purple-100">
            Manage routes, drivers, and monitor operations
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <CardTitle className="text-base">{action.title}</CardTitle>
                <CardDescription className="text-sm">{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Trips */}
        <Card>
          <CardHeader>
            <CardTitle>Active Trips</CardTitle>
            <CardDescription>Real-time trip status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTrips.map((trip, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{trip.driver}</p>
                      <p className="text-sm text-muted-foreground">{trip.route}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">ETA: {trip.eta}</p>
                      <p className="text-xs text-muted-foreground">{trip.progress}% complete</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${trip.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <activity.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
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
    </div>
  );
}
