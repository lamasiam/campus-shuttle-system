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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'on-duty':
        return 'bg-emerald-500 text-white shadow-emerald-100';
      case 'available':
        return 'bg-blue-500 text-white shadow-blue-100';
      case 'off-duty':
        return 'bg-slate-400 text-white shadow-slate-100';
      default:
        return 'bg-slate-400 text-white shadow-slate-100';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      {/* Driver List */}
      <Card className="lg:col-span-4 border-0 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600" />
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-purple-600" />
            Driver Fleet
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">Real-time driver availability status</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[700px] pr-4 -mr-4">
            <div className="space-y-3 pb-4">
              {drivers.map((driver) => (
                <Card key={driver.id} className="group border-0 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-purple-600 transition-colors">
                            <Users size={24} />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            driver.status === 'on-duty' ? 'bg-emerald-500' : 
                            driver.status === 'available' ? 'bg-blue-500' : 'bg-slate-400'
                          }`} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{driver.name}</p>
                          {driver.currentRoute ? (
                            <p className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full inline-block mt-1">
                              {driver.currentRoute}
                            </p>
                          ) : (
                            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">No active route</p>
                          )}
                        </div>
                      </div>
                      <Badge className={`${getStatusStyles(driver.status)} border-0 text-[10px] font-bold uppercase tracking-wider px-2`}>
                        {driver.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Assignment Form & Calendar */}
      <div className="lg:col-span-8 space-y-6">
        <Card className="border-0 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600" />
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-slate-900">Assignment Control</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Schedule and manage driver shifts</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Calendar Column */}
              <div className="space-y-4">
                <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <CalendarIcon size={16} className="text-indigo-600" />
                  1. Choose Date
                </Label>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-center shadow-inner">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-xl bg-white p-3 shadow-sm"
                  />
                </div>
              </div>

              {/* Form Column */}
              <div className="space-y-6">
                <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Clock size={16} className="text-indigo-600" />
                  2. Shift Details
                </Label>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">Driver</Label>
                      <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                        <SelectTrigger className="h-11 border-slate-200 bg-slate-50/50 focus:ring-purple-500 rounded-xl transition-all">
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                          {drivers
                            .filter((d) => d.status !== 'on-duty')
                            .map((driver) => (
                              <SelectItem key={driver.id} value={driver.id} className="rounded-lg mx-1 my-0.5">
                                {driver.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">Route</Label>
                      <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                        <SelectTrigger className="h-11 border-slate-200 bg-slate-50/50 focus:ring-purple-500 rounded-xl transition-all">
                          <SelectValue placeholder="Select route" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                          {routes.map((route) => (
                            <SelectItem key={route.id} value={route.id} className="rounded-lg mx-1 my-0.5">
                              {route.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">Start Time</Label>
                      <Select value={startTime} onValueChange={setStartTime}>
                        <SelectTrigger className="h-11 border-slate-200 bg-slate-50/50 focus:ring-purple-500 rounded-xl transition-all">
                          <SelectValue placeholder="00:00" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                          {['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                            <SelectItem key={time} value={time} className="rounded-lg mx-1 my-0.5">
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500">End Time</Label>
                      <Select value={endTime} onValueChange={setEndTime}>
                        <SelectTrigger className="h-11 border-slate-200 bg-slate-50/50 focus:ring-purple-500 rounded-xl transition-all">
                          <SelectValue placeholder="00:00" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                          {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time) => (
                            <SelectItem key={time} value={time} className="rounded-lg mx-1 my-0.5">
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleAssign}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-purple-100 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
                    disabled={!selectedDriver || !selectedRoute || !startTime || !endTime}
                  >
                    Confirm Assignment
                  </Button>
                </div>
              </div>
            </div>

            {/* Assignments for Selected Date */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100">
                    {selectedDateAssignments.length}
                  </Badge>
                  Schedule for {selectedDate?.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
              </div>
              
              <ScrollArea className="h-[280px] pr-4 -mr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                  {selectedDateAssignments.length === 0 ? (
                    <div className="md:col-span-2 py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
                      <CalendarIcon size={32} className="text-slate-300 mb-2" />
                      <p className="text-sm font-bold text-slate-400">No shifts scheduled for this date</p>
                    </div>
                  ) : (
                    selectedDateAssignments.map((assignment) => (
                      <Card key={assignment.id} className="group border-0 bg-slate-50/80 hover:bg-white hover:shadow-md transition-all duration-300 overflow-hidden">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                              <Users size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{assignment.driverName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-bold text-indigo-600">{assignment.routeName}</span>
                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                                  <Clock size={10} />
                                  {assignment.startTime}-{assignment.endTime}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUnassign(assignment.id)}
                            className="h-8 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            Unassign
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
