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
          lat: shuttle.lat + (Math.random() - 0.5) * 0.001,
          lng: shuttle.lng + (Math.random() - 0.5) * 0.001,
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Live Shuttle Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
          {/* Map background with grid */}
          <div className="absolute inset-0">
            <svg width="100%" height="100%" className="opacity-20">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

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
                  <line
                    key={index}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke={route.color}
                    strokeWidth="3"
                    strokeDasharray="5,5"
                  />
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
                  <div className="relative group">
                    <MapPin
                      size={24}
                      fill={route.color}
                      stroke="white"
                      strokeWidth={2}
                      className="drop-shadow-lg"
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
                <div className="relative group">
                  <div
                    className="p-2 rounded-full shadow-lg"
                    style={{ backgroundColor: route?.color || '#666' }}
                  >
                    <Bus size={20} className="text-white" />
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <div>{route?.name}</div>
                    <div>Status: {shuttle.status}</div>
                    <div>Occupancy: {shuttle.occupancy}%</div>
                  </div>
                  {/* Pulse animation */}
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ backgroundColor: route?.color || '#666', opacity: 0.5 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {visibleRoutes.map((route) => (
            <Badge
              key={route.id}
              variant="outline"
              className="flex items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: route.color }}
              />
              {route.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
