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
      <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl">
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <DialogHeader className="px-6 pt-6 pb-2 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <QrCode size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-slate-900">Your Booking QR Code</DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500">
                Show this code to the driver when boarding
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity blur-xl" />
              <div className="relative bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-xl transition-transform group-hover:scale-[1.02] duration-300">
                {/* Simulated QR Code using SVG pattern */}
                <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-sm">
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
                          fill="#0f172a"
                        />
                      ) : null;
                    })
                  )}
                  {/* Position markers */}
                  <rect x="0" y="0" width="60" height="60" fill="none" stroke="#0f172a" strokeWidth="6" />
                  <rect x="140" y="0" width="60" height="60" fill="none" stroke="#0f172a" strokeWidth="6" />
                  <rect x="0" y="140" width="60" height="60" fill="none" stroke="#0f172a" strokeWidth="6" />
                  <rect x="20" y="20" width="20" height="20" fill="#0f172a" />
                  <rect x="160" y="20" width="20" height="20" fill="#0f172a" />
                  <rect x="20" y="160" width="20" height="20" fill="#0f172a" />
                </svg>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <Card className="border-none bg-slate-50 shadow-inner rounded-2xl overflow-hidden">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-black text-xl text-slate-900">{booking.routeName}</h3>
                  <Badge className="mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none px-3 py-1 shadow-md shadow-emerald-100">
                    Confirmed Ticket
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={14} className="text-blue-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700">{new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={14} className="text-blue-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700">{booking.time}</p>
                  </div>
                </div>

                <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pickup</p>
                      <p className="text-sm font-bold text-slate-700">{booking.pickupStop}</p>
                    </div>
                  </div>
                  <div className="ml-4 h-4 border-l-2 border-dashed border-slate-200" />
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dropoff</p>
                      <p className="text-sm font-bold text-slate-700">{booking.dropoffStop}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Ticket ID</span>
                  <p className="text-xs font-mono font-bold text-slate-400">{booking.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col items-center gap-2">
            <p className="text-xs font-bold text-slate-500 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full border border-amber-100">
              Arrival: 5 mins before departure
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
