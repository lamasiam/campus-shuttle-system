import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, MapPin, Users } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface Route {
  id: string;
  name: string;
  color: string;
  stops: string[];
  frequency: string;
  operatingHours: string;
  estimatedDuration: string;
}

interface RouteScheduleProps {
  routes: Route[];
  onSelectRoute: (routeId: string) => void;
  selectedRoute: string | null;
  onBookSeat: (routeId: string) => void;
}

export function RouteSchedule({ routes, onSelectRoute, selectedRoute, onBookSeat }: RouteScheduleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shuttle Routes & Schedules</CardTitle>
        <CardDescription>View all available routes and their schedules</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {routes.map((route) => (
              <Card
                key={route.id}
                className={`cursor-pointer transition-all ${
                  selectedRoute === route.id
                    ? 'ring-2 ring-primary shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => onSelectRoute(route.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: route.color }}
                      />
                      <div>
                        <CardTitle className="text-lg">{route.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {route.frequency}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {route.estimatedDuration}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">{route.operatingHours}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Stops:</p>
                      <div className="flex flex-col gap-2">
                        {route.stops.map((stop, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <MapPin size={14} className="text-muted-foreground" />
                            <span className="text-sm">{stop}</span>
                            {index < route.stops.length - 1 && (
                              <div className="flex-1 border-t border-dashed ml-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookSeat(route.id);
                      }}
                      className="w-full"
                      size="sm"
                    >
                      Book a Seat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
