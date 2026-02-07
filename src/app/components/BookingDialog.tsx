import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Bus, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  route: {
    id: string;
    name: string;
    stops: string[];
  } | null;
  onBook: (booking: {
    routeId: string;
    date: Date;
    time: string;
    pickupStop: string;
    dropoffStop: string;
  }) => void;
}

export function BookingDialog({ open, onClose, route, onBook }: BookingDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>('');
  const [pickupStop, setPickupStop] = useState<string>('');
  const [dropoffStop, setDropoffStop] = useState<string>('');

  const timeSlots = [
    '07:00 AM',
    '07:30 AM',
    '08:00 AM',
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
  ];

  const handleSubmit = () => {
    if (!route || !date || !time || !pickupStop || !dropoffStop) return;

    onBook({
      routeId: route.id,
      date,
      time,
      pickupStop,
      dropoffStop,
    });

    // Reset form
    setTime('');
    setPickupStop('');
    setDropoffStop('');
    onClose();
  };

  if (!route) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[90vh] p-0 border-0 shadow-2xl overflow-hidden rounded-3xl flex flex-col">
        <DialogHeader className="p-0">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CalendarIcon size={120} className="rotate-12" />
            </div>
            <DialogTitle className="text-3xl font-bold tracking-tight">
              Book a Seat
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-lg mt-2 font-medium">
              {route.name} • Reserve your spot
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Date Selection */}
            <div className="space-y-4">
              <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon size={16} className="text-blue-500" />
                Select Date
              </Label>
              <div className="flex justify-center bg-slate-50/50 rounded-2xl p-2 border border-slate-100">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  required
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-6">
              {/* Time Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <Clock size={16} className="text-blue-500" />
                  Select Time
                </Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-blue-500">
                    <SelectValue placeholder="Choose departure time" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot} className="rounded-lg focus:bg-blue-50">
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pickup Stop */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Pickup Stop</Label>
                <Select value={pickupStop} onValueChange={setPickupStop}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-blue-500">
                    <SelectValue placeholder="Select pickup location" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {route.stops.map((stop) => (
                      <SelectItem key={stop} value={stop} className="rounded-lg focus:bg-blue-50">
                        {stop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dropoff Stop */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Dropoff Stop</Label>
                <Select value={dropoffStop} onValueChange={setDropoffStop}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 focus:ring-blue-500">
                    <SelectValue placeholder="Select dropoff location" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {route.stops
                      .filter((stop) => stop !== pickupStop)
                      .map((stop) => (
                        <SelectItem key={stop} value={stop} className="rounded-lg focus:bg-blue-50">
                          {stop}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          {date && time && pickupStop && dropoffStop && (
            <div className="mt-8 p-5 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-blue-100/50 space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Bus size={64} className="text-blue-900" />
              </div>
              <p className="font-bold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Booking Summary
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Route</p>
                  <p className="font-semibold text-slate-700">{route.name}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Date & Time</p>
                  <p className="font-semibold text-slate-700">{date.toLocaleDateString()} at {time}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">From</p>
                  <p className="font-semibold text-slate-700">{pickupStop}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">To</p>
                  <p className="font-semibold text-slate-700">{dropoffStop}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 gap-3 mt-auto">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="rounded-xl h-12 px-6 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!date || !time || !pickupStop || !dropoffStop}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98] rounded-xl h-12 px-8"
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
