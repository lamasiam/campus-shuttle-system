import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-8 text-white shadow-2xl shadow-purple-200">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight">Coordinator Control Center</h2>
          <p className="mt-2 text-purple-100 text-lg font-medium">
            System status: <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 text-sm font-bold uppercase ml-1">Optimal</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button 
              onClick={() => onNavigate('monitoring')}
              className="bg-white text-purple-600 hover:bg-purple-50 border-0 shadow-lg font-bold"
            >
              <Bus className="mr-2 h-4 w-4" />
              Live Monitor
            </Button>
            <Button 
              variant="outline"
              onClick={() => onNavigate('analytics')}
              className="bg-purple-500/20 border-purple-400/30 text-white hover:bg-purple-500/30 backdrop-blur-sm"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              System Analytics
            </Button>
          </div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color.replace('text', 'bg')}/10 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-gray-900">{stat.value}</div>
              <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Operational Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="group border-0 bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={action.action}
            >
              <div className="p-6">
                <div className={`${action.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-${action.color.split('-')[1]}-100 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{action.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{action.description}</p>
              </div>
              <div className={`h-1 w-full ${action.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Trips Monitor */}
        <Card className="border-0 bg-white shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Fleet Status</CardTitle>
                <CardDescription>Live tracking of active shuttles</CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-0 font-bold uppercase tracking-tighter text-[10px]">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {activeTrips.map((trip, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {trip.driver.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{trip.driver}</p>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{trip.route}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-indigo-600">ETA: {trip.eta}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{trip.progress}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(99,102,241,0.4)]"
                      style={{ width: `${trip.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent System Activity */}
        <Card className="border-0 bg-white shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <CardTitle className="text-lg">System Logs</CardTitle>
            <CardDescription>Latest operational updates</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-5 hover:bg-gray-50/80 transition-colors">
                  <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'route' ? 'bg-blue-50 text-blue-600' :
                    activity.type === 'driver' ? 'bg-green-50 text-green-600' :
                    activity.type === 'incident' ? 'bg-orange-50 text-orange-600' :
                    'bg-purple-50 text-purple-600'
                  }`}>
                    <activity.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 leading-snug">{activity.text}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{activity.time}</p>
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
