import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Bus, Calendar, Bell, MapPin, Star, TrendingUp, Sparkles, Award, ArrowRight, Clock } from 'lucide-react';
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
      bg: 'bg-blue-100',
      gradient: 'from-blue-500 to-indigo-500',
      action: () => onNavigate('bookings'),
    },
    {
      title: 'Notifications',
      value: unreadNotifications,
      icon: Bell,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      gradient: 'from-orange-400 to-pink-500',
      action: () => onNavigate('notifications'),
    },
    {
      title: 'Active Routes',
      value: 3,
      icon: MapPin,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      gradient: 'from-emerald-400 to-teal-500',
      action: () => onNavigate('routes'),
    },
  ];

  const quickActions = [
    {
      title: 'Book a Ride',
      description: 'Find and reserve your seat',
      icon: Bus,
      action: () => onNavigate('routes'),
      gradient: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-200',
    },
    {
      title: 'Live Tracking',
      description: 'See where the shuttle is',
      icon: MapPin,
      action: () => onNavigate('map'),
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-200',
    },
    {
      title: 'Give Feedback',
      description: 'Rate your recent trips',
      icon: Star,
      action: () => onNavigate('feedback'),
      gradient: 'from-amber-400 to-orange-500',
      shadow: 'shadow-amber-200',
    },
  ];

  const recentActivity = [
    { text: 'Booked North Campus Loop', time: '1 hour ago', type: 'booking' },
    { text: 'Completed trip to Downtown', time: '2 hours ago', type: 'trip' },
    { text: 'Earned "Frequent Rider" badge', time: '1 day ago', type: 'achievement' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 md:p-12 text-white shadow-2xl shadow-indigo-200/50 transform hover:scale-[1.01] transition-transform duration-500">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md px-3 py-1">
                  <Sparkles size={14} className="mr-1 text-yellow-300" /> Student Portal
                </Badge>
              </div>
              <h2 className="text-4xl font-black tracking-tight mb-2">
                Hello, {userName}!
              </h2>
              <p className="text-blue-100 text-lg font-medium max-w-lg">
                Your shuttle is on time. Where are we going today?
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => onNavigate('routes')}
                className="bg-white text-indigo-600 hover:bg-blue-50 border-0 shadow-xl h-12 px-6 rounded-xl font-bold transition-all hover:-translate-y-1"
              >
                <Bus className="mr-2 h-5 w-5" />
                Book Now
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="absolute right-20 bottom-10 opacity-10 rotate-12">
          <Bus size={180} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer rounded-3xl"
            onClick={stat.action}
          >
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${stat.gradient}`}></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                  <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
              <div className="text-4xl font-black tracking-tight text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-slate-800">Quick Actions</h3>
            <div className="h-1 flex-1 bg-slate-100 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="group relative overflow-hidden bg-white p-6 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-100 hover:border-transparent hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg ${action.shadow} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon size={28} />
                </div>
                <h4 className="font-bold text-lg text-slate-900 mb-1">{action.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{action.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 bg-white shadow-lg rounded-3xl overflow-hidden h-full">
          <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <TrendingUp size={18} />
              </div>
              <CardTitle className="text-lg font-bold text-slate-800">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors group">
                  <div className="mt-1 flex-shrink-0 relative">
                    <div className="h-3 w-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10 relative" />
                    {index !== recentActivity.length - 1 && (
                      <div className="absolute top-3 left-1.5 w-0.5 h-12 bg-slate-200 -z-0"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700 leading-snug group-hover:text-indigo-700 transition-colors">
                      {activity.text}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-xs font-medium text-slate-400">
                      <Clock size={10} />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-50">
              <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold text-xs uppercase tracking-wider h-10 rounded-xl">
                View All History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
