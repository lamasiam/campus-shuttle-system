import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Users, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  status: 'available' | 'on-duty' | 'off-duty';
  currentRoute?: string;
}

interface Assignment {
  id: string;
  driverId: string;
  driverName: string;
  routeId: string;
  routeName: string;
  date: Date;
  startTime: string;
  endTime: string;
}

interface DriverAssignmentProps {
  drivers: Driver[];
  routes: Array<{ id: string; name: string }>;
  assignments: Assignment[];
  onAssign: (assignment: Omit<Assignment, 'id'>) => void;
  onUnassign: (id: string) => void;
}

export function DriverAssignment({
  drivers,
  routes,
  assignments,
  onAssign,
  onUnassign,
}: DriverAssignmentProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleAssign = () => {
    if (!selectedDate || !selectedDriver || !selectedRoute || !startTime || !endTime) return;

    const driver = drivers.find((d) => d.id === selectedDriver);
    const route = routes.find((r) => r.id === selectedRoute);
    if (!driver || !route) return;

    onAssign({
      driverId: driver.id,
      driverName: driver.name,
      routeId: route.id,
      routeName: route.name,
      date: selectedDate,
      startTime,
      endTime,
    });

    // Reset form
    setSelectedDriver('');
    setSelectedRoute('');
    setStartTime('');
    setEndTime('');
  };

  const todayAssignments = assignments.filter(
    (a) => new Date(a.date).toDateString() === new Date().toDateString()
  );

  const selectedDateAssignments = selectedDate
    ? assignments.filter((a) => new Date(a.date).toDateString() === selectedDate.toDateString())
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-duty':
        return 'bg-green-500';
      case 'available':
        return 'bg-blue-500';
      case 'off-duty':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Driver List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Drivers</CardTitle>
          <CardDescription>Current driver status</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {drivers.map((driver) => (
                <Card key={driver.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        {driver.currentRoute && (
                          <p className="text-xs text-muted-foreground">{driver.currentRoute}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(driver.status)} variant="secondary">
                      {driver.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Assignment Form & Calendar */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Driver Assignment</CardTitle>
          <CardDescription>Schedule drivers to routes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Calendar */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <CalendarIcon size={16} />
              Select Date
            </Label>
            <div className="flex justify-center border rounded-md p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
              />
            </div>
          </div>

          {/* Assignment Form */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium">New Assignment</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Driver</Label>
                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers
                      .filter((d) => d.status !== 'on-duty')
                      .map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Route</Label>
                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleAssign}
              className="w-full"
              disabled={!selectedDriver || !selectedRoute || !startTime || !endTime}
            >
              Assign Driver
            </Button>
          </div>

          {/* Assignments for Selected Date */}
          <div>
            <h3 className="font-medium mb-3">
              Assignments for {selectedDate?.toLocaleDateString()}
            </h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {selectedDateAssignments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No assignments for this date
                  </p>
                ) : (
                  selectedDateAssignments.map((assignment) => (
                    <Card key={assignment.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{assignment.driverName}</p>
                          <p className="text-sm text-muted-foreground">{assignment.routeName}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock size={12} />
                            {assignment.startTime} - {assignment.endTime}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUnassign(assignment.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
