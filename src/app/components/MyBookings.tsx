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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500 text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'completed':
        return 'bg-blue-500 text-blue-700 bg-blue-50 border-blue-100';
      case 'cancelled':
        return 'bg-rose-500 text-rose-700 bg-rose-50 border-rose-100';
      default:
        return 'bg-slate-500 text-slate-700 bg-slate-50 border-slate-100';
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const isCancelled = booking.status === 'cancelled';
    const isCompleted = booking.status === 'completed';
    
    return (
      <Card className="group relative overflow-hidden border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
        <div className={`absolute top-0 left-0 w-1 h-full ${
          booking.status === 'confirmed' ? 'bg-emerald-500' : 
          isCompleted ? 'bg-blue-500' : 'bg-rose-500'
        }`} />
        
        <CardContent className="p-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {booking.routeName}
                </h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-bold border ${getStatusStyles(booking.status)}`}>
                    {booking.status}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-medium">ID: {booking.id.slice(0, 8)}</span>
                </div>
              </div>
              {booking.status === 'confirmed' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCancelBooking(booking.id)}
                  className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <Calendar size={14} />
                </div>
                <span className="text-sm font-medium">{new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <Clock size={14} />
                </div>
                <span className="text-sm font-medium">{booking.time}</span>
              </div>
            </div>

            <div className="relative pl-3 space-y-3 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Pickup</p>
                  <p className="text-sm font-semibold text-slate-700">{booking.pickupStop}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 ring-4 ring-rose-50" />
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 font-bold">Dropoff</p>
                  <p className="text-sm font-semibold text-slate-700">{booking.dropoffStop}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-700">
      {/* Upcoming Bookings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-100">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Upcoming Rides</h3>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Your schedule</p>
            </div>
          </div>
          <Badge className="bg-blue-600 hover:bg-blue-700 shadow-sm px-3 py-1 rounded-lg">
            {upcomingBookings.length}
          </Badge>
        </div>
        
        <ScrollArea className="h-[600px] pr-4 -mr-4">
          <div className="space-y-4 pb-4">
            {upcomingBookings.length === 0 ? (
              <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6 animate-pulse">
                    <Calendar size={40} className="text-slate-200" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">No upcoming rides</h4>
                  <p className="text-sm text-slate-500 max-w-[220px] mt-2 font-medium">Book your next shuttle trip from the Routes tab!</p>
                </CardContent>
              </Card>
            ) : (
              upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Past Bookings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100/50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">Ride History</h3>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Past journeys</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[600px] pr-4 -mr-4">
          <div className="space-y-4 pb-4">
            {pastBookings.length === 0 ? (
              <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6">
                    <Clock size={40} className="text-slate-200" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">No ride history</h4>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Your completed trips will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
