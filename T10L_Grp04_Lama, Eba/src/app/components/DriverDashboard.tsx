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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Driver Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-8 text-white shadow-2xl shadow-emerald-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Driver Dashboard</h2>
            <p className="mt-2 text-emerald-100 text-lg font-medium">
              Welcome back, <span className="text-white font-bold">{driverName}</span>
            </p>
          </div>
          <div className="flex gap-3">
            {!tripActive ? (
              <Button onClick={onStartTrip} className="bg-white text-emerald-600 hover:bg-emerald-50 border-0 shadow-xl px-8 py-6 h-auto text-lg font-bold">
                <PlayCircle className="mr-2 h-6 w-6" />
                Start Shift
              </Button>
            ) : (
              <Button onClick={onEndTrip} className="bg-red-500 text-white hover:bg-red-600 border-0 shadow-xl px-8 py-6 h-auto text-lg font-bold">
                <StopCircle className="mr-2 h-6 w-6" />
                End Shift
              </Button>
            )}
          </div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl"></div>
      </div>

      {/* Trip Status Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Trip Status', value: tripActive ? 'Active' : 'Inactive', icon: Bus, color: tripActive ? 'text-emerald-600' : 'text-gray-400', badge: true },
          { title: 'Current Stop', value: tripActive && assignedRoute ? `${currentStop + 1} / ${assignedRoute.stops.length}` : '—', icon: MapPin, color: 'text-blue-600' },
          { title: 'Passengers Today', value: '24', icon: Users, color: 'text-purple-600' },
        ].map((stat, index) => (
          <Card key={index} className="border-0 bg-white shadow-sm overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color.replace('text', 'bg')}/10 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-gray-900">
                {stat.badge ? (
                  <Badge className={`${tripActive ? 'bg-emerald-500' : 'bg-gray-400'} text-white px-3 py-1 text-sm font-bold border-0`}>
                    {stat.value}
                  </Badge>
                ) : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assigned Route & Progress */}
      {assignedRoute ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-0 bg-white shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Route Progress</CardTitle>
                <CardDescription className="font-medium text-emerald-600">{assignedRoute.name}</CardDescription>
              </div>
              <Badge variant="outline" className="bg-white border-emerald-100 text-emerald-700 font-bold px-3 py-1">
                <Clock className="h-4 w-4 mr-2" />
                {assignedRoute.startTime} - {assignedRoute.endTime}
              </Badge>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4 mb-8">
                <Button variant="outline" onClick={onScanQR} disabled={!tripActive} className="flex-1 h-12 border-emerald-100 hover:bg-emerald-50 text-emerald-700 font-bold">
                  <QrCode className="mr-2 h-5 w-5" />
                  Scan Ticket
                </Button>
                <Button variant="outline" onClick={onReportIncident} className="flex-1 h-12 border-orange-100 hover:bg-orange-50 text-orange-700 font-bold">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Report Issue
                </Button>
              </div>

              <div className="space-y-0 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
                {assignedRoute.stops.map((stop, index) => {
                  const status = stopStatuses[index] || 'pending';
                  const isCurrent = tripActive && index === currentStop;
                  
                  return (
                    <div
                      key={index}
                      className={`relative pl-16 py-4 transition-all duration-300 ${
                        isCurrent ? 'bg-emerald-50/50 rounded-2xl' : ''
                      } ${status === 'departed' ? 'opacity-40' : ''}`}
                    >
                      <div
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full z-10 flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-300 ${
                          status === 'departed'
                            ? 'bg-gray-400 text-white'
                            : status === 'arrived'
                            ? 'bg-yellow-500 text-white ring-4 ring-yellow-100'
                            : isCurrent
                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 animate-pulse'
                            : 'bg-white text-gray-400 border-2 border-gray-200'
                        }`}
                      >
                        {index + 1}
                      </div>
                      
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className={`font-bold ${isCurrent ? 'text-emerald-900 text-lg' : 'text-gray-700'}`}>{stop}</p>
                          <p className={`text-sm font-medium ${
                            status === 'departed' ? 'text-gray-400' : 
                            status === 'arrived' ? 'text-yellow-600' : 
                            isCurrent ? 'text-emerald-600' : 'text-gray-400'
                          }`}>
                            {status === 'departed' ? 'Departed' : 
                             status === 'arrived' ? 'At stop' : 
                             isCurrent ? 'Current Stop' : 'Upcoming'}
                          </p>
                        </div>
                        
                        {tripActive && isCurrent && (
                          <div className="flex gap-2">
                            {status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleStopAction(index, 'arrive')}
                                className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 px-6 font-bold"
                              >
                                Arrive
                              </Button>
                            )}
                            {status === 'arrived' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStopAction(index, 'depart')}
                                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 font-bold"
                              >
                                Depart
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-sm overflow-hidden h-fit">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100">
              <CardTitle className="text-lg">Shift Info</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Shift Duration</p>
                  <p className="text-lg font-bold text-gray-900">8 Hours</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Est. Passengers</p>
                  <p className="text-lg font-bold text-gray-900">~120</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                <p className="text-sm font-medium text-indigo-700 leading-relaxed">
                  Remember to verify all passengers' QR codes before departure.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="p-12 text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
          <Bus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No Assigned Route</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            You don't have an assigned route for this shift yet. Please contact the coordinator.
          </p>
        </Card>
      )}
    </div>
  );
}
