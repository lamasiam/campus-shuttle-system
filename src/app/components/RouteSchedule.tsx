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
    <Card className="border-0 bg-white shadow-xl shadow-indigo-100/20 overflow-hidden">
      <CardHeader className="bg-gray-50/50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <MapPin className="text-white h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Shuttle Routes</CardTitle>
            <CardDescription className="font-medium text-indigo-600">Available campus transportation</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {routes.map((route) => (
              <Card
                key={route.id}
                className={`group relative border-0 bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                  selectedRoute === route.id
                    ? 'ring-2 ring-indigo-500 shadow-indigo-100'
                    : ''
                }`}
                onClick={() => onSelectRoute(route.id)}
              >
                <div 
                  className="absolute top-0 left-0 w-1.5 h-full transition-transform group-hover:scale-y-110"
                  style={{ backgroundColor: route.color }}
                />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{route.name}</CardTitle>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <Clock size={14} className="text-indigo-500" />
                          {route.frequency}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <Users size={14} className="text-emerald-500" />
                          {route.estimatedDuration}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold px-2 py-0.5 text-[10px] uppercase">
                      {route.operatingHours}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative pl-4 space-y-4 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:bg-gray-100">
                      {route.stops.map((stop, index) => (
                        <div key={index} className="flex items-center gap-3 relative">
                          <div className={`absolute -left-[1.35rem] w-2 h-2 rounded-full border-2 border-white shadow-sm ${
                            index === 0 ? 'bg-indigo-500' : 
                            index === route.stops.length - 1 ? 'bg-emerald-500' : 'bg-gray-300'
                          }`} />
                          <span className="text-sm font-medium text-gray-600">{stop}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookSeat(route.id);
                      }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-100 font-bold h-11"
                    >
                      Book Your Seat
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
