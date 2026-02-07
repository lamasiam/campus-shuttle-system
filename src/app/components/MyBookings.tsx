import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Clock, MapPin, Trash2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface Booking {
  id: string;
  routeId: string;
  routeName: string;
  date: Date;
  time: string;
  pickupStop: string;
  dropoffStop: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}

interface MyBookingsProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
}

export function MyBookings({ bookings, onCancelBooking }: MyBookingsProps) {
  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.date) >= new Date()
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || new Date(b.date) < new Date()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{booking.routeName}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {booking.status}
              </Badge>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(booking.status)}`} />
            </div>
          </div>
          {booking.status === 'confirmed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancelBooking(booking.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={14} />
            <span>{new Date(booking.date).toLocaleDateString()}</span>
            <Clock size={14} className="ml-2" />
            <span>{booking.time}</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-green-500 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Pickup</p>
                <p>{booking.pickupStop}</p>
              </div>
            </div>
            <div className="ml-1 border-l-2 border-dashed border-gray-300 h-4" />
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-red-500 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Dropoff</p>
                <p>{booking.dropoffStop}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>Your confirmed shuttle reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No upcoming bookings</p>
                  <p className="text-sm">Book a shuttle to see it here</p>
                </div>
              ) : (
                upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Past Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Past Bookings</CardTitle>
          <CardDescription>Your booking history</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {pastBookings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No past bookings</p>
                </div>
              ) : (
                pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
