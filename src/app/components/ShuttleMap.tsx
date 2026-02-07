import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Bus, MapPin } from 'lucide-react';

interface ShuttleMapProps {
  selectedRoute: string | null;
  shuttles: Array<{
    id: string;
    routeId: string;
    lat: number;
    lng: number;
    status: string;
    occupancy: number;
  }>;
}

export function ShuttleMap({ selectedRoute, shuttles }: ShuttleMapProps) {
  const [animatedShuttles, setAnimatedShuttles] = useState(shuttles);

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedShuttles((prev) =>
        prev.map((shuttle) => ({
          ...shuttle,
          lat: shuttle.lat + (Math.random() - 0.5) * 0.0005,
          lng: shuttle.lng + (Math.random() - 0.5) * 0.0005,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setAnimatedShuttles(shuttles);
  }, [shuttles]);

  const filteredShuttles = selectedRoute
    ? animatedShuttles.filter((s) => s.routeId === selectedRoute)
    : animatedShuttles;

  const routes = [
    {
      id: 'route-1',
      name: 'North Campus Loop',
      color: '#3b82f6',
      gradient: 'from-blue-500 to-indigo-600',
      stops: [
        { name: 'Main Library', lat: 40.7589, lng: -73.9851 },
        { name: 'Science Building', lat: 40.7609, lng: -73.9831 },
        { name: 'Student Union', lat: 40.7629, lng: -73.9811 },
        { name: 'North Dorms', lat: 40.7649, lng: -73.9791 },
      ],
    },
    {
      id: 'route-2',
      name: 'South Campus Express',
      color: '#10b981',
      gradient: 'from-emerald-500 to-teal-600',
      stops: [
        { name: 'Main Gate', lat: 40.7529, lng: -73.9891 },
        { name: 'Engineering Hall', lat: 40.7549, lng: -73.9871 },
        { name: 'Arts Center', lat: 40.7569, lng: -73.9851 },
        { name: 'Sports Complex', lat: 40.7589, lng: -73.9831 },
      ],
    },
    {
      id: 'route-3',
      name: 'Downtown Connector',
      color: '#f59e0b',
      gradient: 'from-amber-500 to-orange-600',
      stops: [
        { name: 'Campus Center', lat: 40.7609, lng: -73.9871 },
        { name: 'Medical School', lat: 40.7629, lng: -73.9851 },
        { name: 'Law Building', lat: 40.7649, lng: -73.9831 },
        { name: 'Downtown Station', lat: 40.7669, lng: -73.9811 },
      ],
    },
  ];

  const selectedRouteData = routes.find((r) => r.id === selectedRoute);
  const visibleRoutes = selectedRoute ? [selectedRouteData!] : routes;

  return (
    <Card className="h-full border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white/80 backdrop-blur-md">
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Bus size={20} />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Live Shuttle Map</CardTitle>
            <p className="text-xs text-slate-500 font-medium">Real-time tracking and routes</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[500px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
          {/* Map background with grid */}
          <div className="absolute inset-0">
            <svg width="100%" height="100%" className="opacity-[0.15]">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Map Labels (Simulated) */}
          <div className="absolute top-10 left-10 text-[10px] font-bold text-slate-300 uppercase tracking-widest pointer-events-none">North Sector</div>
          <div className="absolute bottom-10 right-10 text-[10px] font-bold text-slate-300 uppercase tracking-widest pointer-events-none">South Sector</div>

          {/* Routes */}
          {visibleRoutes.map((route) => (
            <svg
              key={route.id}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              {route.stops.map((stop, index) => {
                if (index === route.stops.length - 1) return null;
                const nextStop = route.stops[index + 1];
                const x1 = ((stop.lng + 73.9851) * 50000) % 100;
                const y1 = ((stop.lat - 40.7589) * 50000) % 100;
                const x2 = ((nextStop.lng + 73.9851) * 50000) % 100;
                const y2 = ((nextStop.lat - 40.7589) * 50000) % 100;

                return (
                  <g key={index}>
                    {/* Shadow/Glow line */}
                    <line
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke={route.color}
                      strokeWidth="6"
                      strokeOpacity="0.1"
                    />
                    {/* Main line */}
                    <line
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke={route.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}
            </svg>
          ))}

          {/* Stops */}
          {visibleRoutes.map((route) =>
            route.stops.map((stop, index) => {
              const x = ((stop.lng + 73.9851) * 50000) % 100;
              const y = ((stop.lat - 40.7589) * 50000) % 100;

              return (
                <div
                  key={`${route.id}-stop-${index}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    zIndex: 2,
                  }}
                >
                  <div className="relative group/stop">
                    <div className="w-6 h-6 flex items-center justify-center transition-transform group-hover/stop:scale-125 duration-300">
                      <MapPin
                        size={20}
                        fill={route.color}
                        stroke="white"
                        strokeWidth={2}
                        className="drop-shadow-md"
                      />
                    </div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-lg opacity-0 group-hover/stop:opacity-100 transition-all duration-200 whitespace-nowrap shadow-xl border border-white/10 translate-y-2 group-hover/stop:translate-y-0">
                      {stop.name}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Shuttles */}
          {filteredShuttles.map((shuttle) => {
            const x = ((shuttle.lng + 73.9851) * 50000) % 100;
            const y = ((shuttle.lat - 40.7589) * 50000) % 100;
            const route = routes.find((r) => r.id === shuttle.routeId);

            return (
              <div
                key={shuttle.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  zIndex: 3,
                }}
              >
                <div className="relative group/shuttle">
                  {/* Pulse animation */}
                  <div
                    className="absolute -inset-2 rounded-full animate-ping duration-1000"
                    style={{ backgroundColor: route?.color || '#666', opacity: 0.3 }}
                  />
                  
                  <div
                    className={`p-2.5 rounded-full shadow-lg ring-4 ring-white transition-transform group-hover/shuttle:scale-110 duration-300 bg-gradient-to-br ${route?.gradient || 'from-gray-500 to-gray-600'}`}
                  >
                    <Bus size={18} className="text-white" />
                  </div>

                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 p-3 bg-slate-900/95 backdrop-blur-md text-white rounded-xl opacity-0 group-hover/shuttle:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl border border-white/10 translate-y-4 group-hover/shuttle:translate-y-0 min-w-[140px]">
                    <div className="text-xs font-black uppercase tracking-wider mb-1 opacity-60">Shuttle {shuttle.id}</div>
                    <div className="font-bold text-sm mb-2">{route?.name}</div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="opacity-70">Status</span>
                        <span className="bg-white/20 px-1.5 py-0.5 rounded text-white font-bold">{shuttle.status}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="opacity-70">Occupancy</span>
                        <span className="text-white font-bold">{shuttle.occupancy}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-500" 
                          style={{ width: `${shuttle.occupancy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-3">
          {visibleRoutes.map((route) => (
            <div
              key={route.id}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md cursor-default group`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full shadow-sm ring-2 ring-white transition-transform group-hover:scale-110 bg-gradient-to-br ${route.gradient}`}
              />
              <span className="text-xs font-bold text-slate-700">{route.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
