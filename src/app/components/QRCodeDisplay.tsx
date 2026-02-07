import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

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
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (booking && open) {
      generateQRCode();
    }
  }, [booking, open]);

  const generateQRCode = async () => {
    if (!booking) return;
    try {
      // Create a comprehensive data payload for the QR code
      const qrData = JSON.stringify({
        id: booking.id,
        route: booking.routeName,
        date: new Date(booking.date).toISOString(),
        time: booking.time,
        from: booking.pickupStop,
        to: booking.dropoffStop,
        valid: true
      });
      
      const url = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

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
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Booking QR Code" className="w-[200px] h-[200px]" />
                ) : (
                  <div className="w-[200px] h-[200px] flex items-center justify-center bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-400 font-medium">Generating QR...</span>
                  </div>
                )}
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
