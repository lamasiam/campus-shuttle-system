import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bus, Clock, MapPin, Users, AlertCircle, PlayCircle, StopCircle, QrCode } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface DriverDashboardProps {
  driverName: string;
  assignedRoute: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    stops: string[];
  } | null;
  onStartTrip: () => void;
  onEndTrip: () => void;
  onUpdateStop: (stop: string, status: 'arrived' | 'departed') => void;
  onScanQR: () => void;
  onReportIncident: () => void;
  tripActive: boolean;
  currentStop: number;
}

export function DriverDashboard({
  driverName,
  assignedRoute,
  onStartTrip,
  onEndTrip,
  onUpdateStop,
  onScanQR,
  onReportIncident,
  tripActive,
  currentStop,
}: DriverDashboardProps) {
  const [stopStatuses, setStopStatuses] = useState<{ [key: number]: 'pending' | 'arrived' | 'departed' }>({});

  const handleStopAction = (index: number, action: 'arrive' | 'depart') => {
    if (!assignedRoute) return;
    
    const status = action === 'arrive' ? 'arrived' : 'departed';
    setStopStatuses({ ...stopStatuses, [index]: status });
    onUpdateStop(assignedRoute.stops[index], status);
  };

  return (
    <div className="space-y-6">
      {/* Driver Header */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Driver Dashboard</CardTitle>
          <CardDescription className="text-green-100">
            Welcome, {driverName}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Trip Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trip Status</CardTitle>
            <Bus className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tripActive ? (
                <Badge className="bg-green-500">Active</Badge>
              ) : (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Stop</CardTitle>
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tripActive && assignedRoute ? `${currentStop + 1}/${assignedRoute.stops.length}` : '-'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passengers Today</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Route */}
      {assignedRoute ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Assigned Route & Shift</CardTitle>
                <CardDescription>{assignedRoute.name}</CardDescription>
              </div>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {assignedRoute.startTime} - {assignedRoute.endTime}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Trip Controls */}
              <div className="flex gap-3">
                {!tripActive ? (
                  <Button onClick={onStartTrip} className="flex-1 bg-green-600 hover:bg-green-700">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Trip
                  </Button>
                ) : (
                  <Button onClick={onEndTrip} className="flex-1 bg-red-600 hover:bg-red-700">
                    <StopCircle className="mr-2 h-4 w-4" />
                    End Trip
                  </Button>
                )}
                <Button variant="outline" onClick={onScanQR} disabled={!tripActive}>
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan QR
                </Button>
                <Button variant="outline" onClick={onReportIncident}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </div>

              {/* Route Stops */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Route Stops</h4>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {assignedRoute.stops.map((stop, index) => {
                      const status = stopStatuses[index] || 'pending';
                      const isCurrent = tripActive && index === currentStop;
                      
                      return (
                        <Card
                          key={index}
                          className={`p-4 ${
                            isCurrent ? 'ring-2 ring-green-500 bg-green-50' : ''
                          } ${status === 'departed' ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                                  status === 'departed'
                                    ? 'bg-gray-400 text-white'
                                    : status === 'arrived'
                                    ? 'bg-yellow-500 text-white'
                                    : isCurrent
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200'
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{stop}</p>
                                <p className="text-sm text-muted-foreground">
                                  {status === 'departed'
                                    ? 'Departed'
                                    : status === 'arrived'
                                    ? 'At stop'
                                    : isCurrent
                                    ? 'Next stop'
                                    : 'Upcoming'}
                                </p>
                              </div>
                            </div>
                            {tripActive && isCurrent && (
                              <div className="flex gap-2">
                                {status === 'pending' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleStopAction(index, 'arrive')}
                                  >
                                    Arrive
                                  </Button>
                                )}
                                {status === 'arrived' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStopAction(index, 'depart')}
                                  >
                                    Depart
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Bus className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg font-medium">No Route Assigned</p>
            <p className="text-sm text-muted-foreground">
              Contact your coordinator for route assignment
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
