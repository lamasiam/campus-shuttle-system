import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, QrCode } from 'lucide-react';

interface Booking {
  id: string;
  routeName: string;
  date: Date;
  time: string;
  pickupStop: string;
  dropoffStop: string;
}

interface QRCodeDisplayProps {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export function QRCodeDisplay({ open, onClose, booking }: QRCodeDisplayProps) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Your Booking QR Code</DialogTitle>
          <DialogDescription>
            Show this code to the driver when boarding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg border-4 border-gray-200">
              {/* Simulated QR Code using SVG pattern */}
              <svg width="200" height="200" viewBox="0 0 200 200">
                <rect width="200" height="200" fill="white" />
                {/* Generate a simple QR-like pattern */}
                {Array.from({ length: 10 }).map((_, row) =>
                  Array.from({ length: 10 }).map((_, col) => {
                    const shouldFill = (row + col + parseInt(booking.id.slice(-2))) % 3 !== 0;
                    return shouldFill ? (
                      <rect
                        key={`${row}-${col}`}
                        x={col * 20}
                        y={row * 20}
                        width="18"
                        height="18"
                        fill="black"
                      />
                    ) : null;
                  })
                )}
                {/* Position markers */}
                <rect x="0" y="0" width="60" height="60" fill="none" stroke="black" strokeWidth="6" />
                <rect x="140" y="0" width="60" height="60" fill="none" stroke="black" strokeWidth="6" />
                <rect x="0" y="140" width="60" height="60" fill="none" stroke="black" strokeWidth="6" />
                <rect x="20" y="20" width="20" height="20" fill="black" />
                <rect x="160" y="20" width="20" height="20" fill="black" />
                <rect x="20" y="160" width="20" height="20" fill="black" />
              </svg>
            </div>
          </div>

          {/* Booking Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-lg">{booking.routeName}</h3>
                  <Badge className="mt-2 bg-green-500">Confirmed</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-green-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup</p>
                      <p>{booking.pickupStop}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-red-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Dropoff</p>
                      <p>{booking.dropoffStop}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 text-center text-xs text-muted-foreground">
                  Booking ID: {booking.id}
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-center text-muted-foreground">
            Please arrive 5 minutes before departure time
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
