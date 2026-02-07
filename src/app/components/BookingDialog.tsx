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
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a Seat - {route.name}</DialogTitle>
          <DialogDescription>
            Reserve your seat on this shuttle route
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon size={16} />
              Select Date
            </Label>
            <div className="flex justify-center border rounded-md p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-md"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock size={16} />
              Select Time
            </Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Choose departure time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pickup Stop */}
          <div className="space-y-2">
            <Label>Pickup Stop</Label>
            <Select value={pickupStop} onValueChange={setPickupStop}>
              <SelectTrigger>
                <SelectValue placeholder="Select pickup location" />
              </SelectTrigger>
              <SelectContent>
                {route.stops.map((stop) => (
                  <SelectItem key={stop} value={stop}>
                    {stop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropoff Stop */}
          <div className="space-y-2">
            <Label>Dropoff Stop</Label>
            <Select value={dropoffStop} onValueChange={setDropoffStop}>
              <SelectTrigger>
                <SelectValue placeholder="Select dropoff location" />
              </SelectTrigger>
              <SelectContent>
                {route.stops
                  .filter((stop) => stop !== pickupStop)
                  .map((stop) => (
                    <SelectItem key={stop} value={stop}>
                      {stop}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Booking Summary */}
          {date && time && pickupStop && dropoffStop && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="font-medium">Booking Summary</p>
              <div className="text-sm space-y-1">
                <p>Route: {route.name}</p>
                <p>Date: {date.toLocaleDateString()}</p>
                <p>Time: {time}</p>
                <p>From: {pickupStop}</p>
                <p>To: {dropoffStop}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!date || !time || !pickupStop || !dropoffStop}
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
