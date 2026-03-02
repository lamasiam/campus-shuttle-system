import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { QrCode, CheckCircle, XCircle, User } from 'lucide-react';
import { Badge } from './ui/badge';
import api from '../../services/api';

interface QRScannerProps {
  open: boolean;
  onClose: () => void;
  onScan: (bookingId: string) => void;
}

export function QRScanner({ open, onClose, onScan }: QRScannerProps) {
  const [scannedBooking, setScannedBooking] = useState<{
    id: string;
    passengerName: string;
    routeName: string;
    pickupStopName: string;
    dropoffStopName: string;
    departureTime?: string;
    valid: boolean;
  } | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const canUseCamera = useMemo(() => {
    return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
  }, []);

  const stopCamera = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const verifyQrCode = async (qrCode: string) => {
    setVerifying(true);
    setCameraError(null);
    try {
      const res = await api.driver.scanQR(qrCode);
      if (res?.success && res?.booking) {
        const booking = res.booking;
        const display = {
          id: booking.id,
          passengerName: booking.passengerName || booking.studentId,
          routeName: booking.routeName || 'Route',
          pickupStopName: booking.pickupStopName ?? String(booking.pickupStop),
          dropoffStopName: booking.dropoffStopName ?? String(booking.dropoffStop),
          departureTime: booking.departureTime,
          valid: true,
        };
        setScannedBooking(display);
        onScan(display.id);
      } else {
        setScannedBooking({
          id: '',
          passengerName: 'Unknown',
          routeName: 'Unknown',
          pickupStopName: 'Unknown',
          dropoffStopName: 'Unknown',
          valid: false,
        });
      }
    } catch (e: any) {
      setScannedBooking({
        id: '',
        passengerName: 'Unknown',
        routeName: 'Unknown',
        pickupStopName: 'Unknown',
        dropoffStopName: 'Unknown',
        valid: false,
      });
      setCameraError(e?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleDetected = async (qrCode: string) => {
    stopCamera();
    await verifyQrCode(qrCode);
  };

  const startCamera = async () => {
    setCameraError(null);
    if (!canUseCamera) {
      setCameraError('Camera is not available in this browser/device.');
      return;
    }
    if (!videoRef.current || !canvasRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const BarcodeDetectorCtor = (window as any).BarcodeDetector;
      if (!BarcodeDetectorCtor) {
        setCameraError('QR scanning is not supported on this device. Use manual input below.');
        return;
      }

      const detector = new BarcodeDetectorCtor({ formats: ['qr_code'] });
      const loop = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (w > 0 && h > 0) {
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, w, h);
            try {
              const codes = await detector.detect(canvas);
              const code = codes?.[0]?.rawValue;
              if (code) {
                await handleDetected(code);
                return;
              }
            } catch {
              setCameraError('Unable to scan QR using camera. Use manual input below.');
              return;
            }
          }
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (e: any) {
      setCameraError(e?.message || 'Unable to access camera. Use manual input below.');
    }
  };

  useEffect(() => {
    if (!open) return;
    if (!scannedBooking) {
      startCamera();
    }
    return () => stopCamera();
  }, [open]);

  const handleClose = () => {
    setScannedBooking(null);
    setManualCode('');
    setCameraError(null);
    setVerifying(false);
    stopCamera();
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
              <div className="relative group max-w-[260px] mx-auto mb-6">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity blur-xl" />
                <div className="relative w-full aspect-square mx-auto border-4 border-dashed border-slate-200 rounded-3xl bg-white shadow-inner overflow-hidden group-hover:border-emerald-300 transition-colors duration-300 flex items-center justify-center">
                  {canUseCamera ? (
                    <>
                      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="absolute inset-4 border border-emerald-500/30 rounded-2xl" />
                    </>
                  ) : (
                    <QrCode size={64} className="text-slate-300" />
                  )}
                </div>
              </div>

              <p className="text-sm font-bold text-slate-500 mb-4 bg-slate-50 py-2 rounded-full border border-slate-100">
                Position the QR code within the frame
              </p>

              {cameraError ? (
                <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl mb-4">
                  {cameraError}
                </p>
              ) : null}

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Paste ticket code (manual)"
                    className="flex-1 h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                  <Button
                    onClick={() => manualCode.trim() && verifyQrCode(manualCode.trim())}
                    disabled={!manualCode.trim() || verifying}
                    className="h-12 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-lg shadow-slate-200 transition-all active:scale-95"
                  >
                    {verifying ? 'Checking...' : 'Verify'}
                  </Button>
                </div>
                <Button
                  onClick={() => startCamera()}
                  disabled={!canUseCamera || verifying}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black shadow-lg shadow-emerald-200 rounded-xl transition-all active:scale-95"
                >
                  Start Camera Scan
                </Button>
              </div>
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
                        <p className="font-bold text-slate-900">{scannedBooking.passengerName}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Route</span>
                        <span className="font-bold text-slate-700">{scannedBooking.routeName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pickup</span>
                        <span className="font-bold text-slate-700">{scannedBooking.pickupStopName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dropoff</span>
                        <span className="font-bold text-slate-700">{scannedBooking.dropoffStopName}</span>
                      </div>
                      {scannedBooking.departureTime ? (
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Departure</span>
                          <span className="font-bold text-slate-700">{new Date(scannedBooking.departureTime).toLocaleString()}</span>
                        </div>
                      ) : null}
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
                      onClick={() => { setScannedBooking(null); startCamera(); }} 
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
