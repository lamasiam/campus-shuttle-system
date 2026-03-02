import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, TrendingUp, Clock, AlertCircle, CheckCircle2, Activity, ArrowUpRight } from 'lucide-react';

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
  const avgBookingsPerRoute = totalBookings / (routes.length || 1);

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
    { name: 'Open', value: incidents.filter((i) => i.status === 'open').length, color: '#f43f5e' },
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

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h2>
          <p className="text-slate-500 font-medium">Real-time metrics and performance analytics</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 text-sm font-bold text-slate-600">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Operational
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-xl shadow-blue-100/50 overflow-hidden group hover:scale-[1.02] transition-all duration-300 rounded-3xl bg-white">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Users size={80} />
          </div>
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Bookings</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-lg shadow-blue-100">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-slate-900 mb-2">{totalBookings}</div>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12} className="mr-1" /> +12%
              </span>
              <p className="text-xs font-medium text-slate-400">vs last week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-emerald-100/50 overflow-hidden group hover:scale-[1.02] transition-all duration-300 rounded-3xl bg-white">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={80} />
          </div>
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Routes</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-lg shadow-emerald-100">
              <Activity className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-slate-900 mb-2">{routes.length}</div>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <CheckCircle2 size={12} className="mr-1" /> 100%
              </span>
              <p className="text-xs font-medium text-slate-400">operational</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-amber-100/50 overflow-hidden group hover:scale-[1.02] transition-all duration-300 rounded-3xl bg-white">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <Clock size={80} />
          </div>
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Avg Wait Time</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-lg shadow-amber-100">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-slate-900 mb-2">4.2m</div>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12} className="mr-1 rotate-180" /> -30s
              </span>
              <p className="text-xs font-medium text-slate-400">better than avg</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-rose-100/50 overflow-hidden group hover:scale-[1.02] transition-all duration-300 rounded-3xl bg-white">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <AlertCircle size={80} />
          </div>
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-pink-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Open Incidents</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300 shadow-lg shadow-rose-100">
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-slate-900 mb-2">{openIncidents}</div>
            <div className="flex items-center gap-2">
              {openIncidents > 0 ? (
                 <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                  Action Req
                </span>
              ) : (
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  All Clear
                </span>
              )}
              <p className="text-xs font-medium text-slate-400">{resolvedIncidents} resolved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bookings Trend */}
        <Card className="border-none shadow-lg shadow-indigo-100/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader>
            <CardTitle className="font-bold text-slate-800">Booking Trends</CardTitle>
            <CardDescription className="font-medium text-slate-400">Daily passenger volume (Last 7 Days)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bookingsTrend}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorBookings)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Route Distribution */}
        <Card className="border-none shadow-lg shadow-indigo-100/50 rounded-3xl overflow-hidden bg-white">
          <CardHeader>
            <CardTitle className="font-bold text-slate-800">Popular Routes</CardTitle>
            <CardDescription className="font-medium text-slate-400">Passenger distribution by route</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsByRoute} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                    width={80}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="bookings" radius={[0, 6, 6, 0]} barSize={32}>
                    {bookingsByRoute.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
