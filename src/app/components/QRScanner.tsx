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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Passenger QR Code</DialogTitle>
          <DialogDescription>
            Verify passenger booking before boarding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!scannedBooking ? (
            <div className="text-center py-8">
              <div className="w-48 h-48 mx-auto mb-4 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <QrCode size={64} className="text-gray-400" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Position QR code within the frame
              </p>
              <Button onClick={handleSimulateScan}>
                Simulate Scan
              </Button>
            </div>
          ) : (
            <Card className={scannedBooking.valid ? 'border-green-500' : 'border-red-500'}>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  {scannedBooking.valid ? (
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-2" />
                  ) : (
                    <XCircle size={48} className="text-red-500 mx-auto mb-2" />
                  )}
                  <h3 className="font-semibold text-lg">
                    {scannedBooking.valid ? 'Valid Booking' : 'Invalid Booking'}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" />
                    <span className="font-medium">{scannedBooking.passenger}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Route:</span> {scannedBooking.route}</p>
                    <p><span className="text-muted-foreground">Pickup:</span> {scannedBooking.pickup}</p>
                    <p><span className="text-muted-foreground">Dropoff:</span> {scannedBooking.dropoff}</p>
                  </div>
                  
                  {scannedBooking.valid ? (
                    <Badge className="w-full justify-center bg-green-500">
                      Verified - Allow Boarding
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="w-full justify-center">
                      Booking Not Found
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 mt-6">
                  <Button variant="outline" onClick={() => setScannedBooking(null)} className="flex-1">
                    Scan Another
                  </Button>
                  <Button onClick={handleClose} className="flex-1">
                    Done
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
