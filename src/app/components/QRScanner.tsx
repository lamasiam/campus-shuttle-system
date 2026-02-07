import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { QrCode, CheckCircle, XCircle, User } from 'lucide-react';
import { Badge } from './ui/badge';

interface QRScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (bookingId: string) => void;
}

export function QRScanner({ open, onClose, onScan }: QRScannerProps) {
  const [scannedBooking, setScannedBooking] = useState<{
    id: string;
    passenger: string;
    route: string;
    pickup: string;
    dropoff: string;
    valid: boolean;
  } | null>(null);

  const handleSimulateScan = () => {
    // Simulate QR code scan
    const mockBooking = {
      id: 'booking-' + Date.now(),
      passenger: 'John Doe',
      route: 'North Campus Loop',
      pickup: 'Main Library',
      dropoff: 'Student Union',
      valid: Math.random() > 0.2, // 80% valid bookings
    };
    setScannedBooking(mockBooking);
    if (mockBooking.valid) {
      onScan(mockBooking.id);
    }
  };

  const handleClose = () => {
    setScannedBooking(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl">
        <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />
        <DialogHeader className="px-6 pt-6 pb-2 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <QrCode size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-slate-900">Scan Passenger QR Code</DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-500">
                Verify passenger booking before boarding
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          {!scannedBooking ? (
            <div className="text-center py-8">
              <div className="relative group max-w-[200px] mx-auto mb-6">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity blur-xl" />
                <div className="relative w-48 h-48 mx-auto border-4 border-dashed border-slate-200 rounded-3xl flex items-center justify-center bg-white shadow-inner group-hover:border-emerald-300 transition-colors duration-300">
                  <div className="absolute inset-4 border border-emerald-500/20 rounded-2xl animate-pulse" />
                  <QrCode size={64} className="text-slate-300 group-hover:text-emerald-400 transition-colors duration-300" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-6 bg-slate-50 py-2 rounded-full border border-slate-100">
                Position QR code within the frame
              </p>
              <Button 
                onClick={handleSimulateScan}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black shadow-lg shadow-emerald-200 rounded-xl transition-all active:scale-95"
              >
                Simulate Scan
              </Button>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 duration-300">
              <Card className={`border-none shadow-2xl overflow-hidden rounded-3xl ${scannedBooking.valid ? 'shadow-emerald-100/50 bg-emerald-50/30' : 'shadow-rose-100/50 bg-rose-50/30'}`}>
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="text-center mb-6">
                    {scannedBooking.valid ? (
                      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-inner">
                        <CheckCircle size={48} />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-600 shadow-inner">
                        <XCircle size={48} />
                      </div>
                    )}
                    <h3 className={`font-black text-2xl ${scannedBooking.valid ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {scannedBooking.valid ? 'Valid Booking' : 'Invalid Booking'}
                    </h3>
                  </div>

                  <div className="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Passenger</p>
                        <p className="font-bold text-slate-900">{scannedBooking.passenger}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Route</span>
                        <span className="font-bold text-slate-700">{scannedBooking.route}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pickup</span>
                        <span className="font-bold text-slate-700">{scannedBooking.pickup}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dropoff</span>
                        <span className="font-bold text-slate-700">{scannedBooking.dropoff}</span>
                      </div>
                    </div>
                    
                    {scannedBooking.valid ? (
                      <Badge className="w-full h-10 justify-center bg-gradient-to-r from-emerald-500 to-teal-600 border-none text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-100">
                        Verified - Allow Boarding
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="w-full h-10 justify-center border-none font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-rose-100">
                        Booking Not Found
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button 
                      variant="outline" 
                      onClick={() => setScannedBooking(null)} 
                      className="flex-1 h-12 rounded-xl border-slate-200 font-bold hover:bg-slate-50"
                    >
                      Scan Another
                    </Button>
                    <Button 
                      onClick={handleClose} 
                      className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
                    >
                      Done
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
