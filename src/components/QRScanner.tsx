import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Scan, X } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanFailure }) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  const cleanupScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current = null;
      }
    } catch (err) {
      console.error('Error cleaning up scanner:', err);
    }
  };

  useEffect(() => {
    // Cleanup scanner on unmount
    return () => {
      cleanupScanner();
    };
  }, []);

  const startScanner = async () => {
    setError(null);

    try {
      await cleanupScanner(); // Ensure previous instance is cleaned up

      // Check if the container element exists
      if (!scannerContainerRef.current) {
        throw new Error('QR scanner container not found');
      }

      const html5QrCode = new Html5Qrcode('qr-reader', /* verbose */ false);
      scannerRef.current = html5QrCode;

      // Request camera permissions first
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        throw new Error('No cameras found on this device');
      }

      setIsScanning(true);

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          cleanupScanner().then(() => {
            setIsScanning(false);
            onScanSuccess(decodedText);
          });
        },
        (errorMessage) => {
          // Handle scan errors (silent during normal operation)
          if (onScanFailure) {
            onScanFailure(errorMessage);
          }
        }
      ).catch((err) => {
        console.error('Error starting scanner:', err);
        setError('Failed to start camera. Please check permissions and try again.');
        setIsScanning(false);
      });
    } catch (err) {
      console.error('QR Scanner Error:', err);
      setIsScanning(false);
      setError(
        (err as Error).message ||
        'Failed to start camera. Please check permissions and try again.'
      );
    }
  };

  const stopScanner = async () => {
    try {
      await cleanupScanner();
      setIsScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
      setError('Failed to stop scanner');
    }
  };

  return (
    <div className="mb-6">
      <div
        className="relative mx-auto rounded-2xl overflow-hidden bg-zinc-950/5 border-2 border-[#e62b1e] mb-4 shadow-[0_12px_24px_rgba(0,0,0,0.15)]"
        style={{
          maxWidth: "100%",
          height: "350px"
        }}
      >
        <div
          id="qr-reader"
          ref={scannerContainerRef}
          className="w-full h-full"
        ></div>

        {/* Overlay when scanner is not active */}
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900/90 via-zinc-700/80 to-zinc-900/90">
            <div className="text-white text-center px-4">
              <Scan size={48} className="mx-auto mb-4 text-[#e62b1e]" />
              <h3 className="text-2xl font-bold mb-2 tracking-tight">QR Scanner</h3>
              <p className="text-sm mb-4 text-zinc-200">Tap the button below to scan attendee QR codes</p>
              <button
                onClick={startScanner}
                className="bg-[#e62b1e] text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-[0_8px_18px_rgba(230,43,30,0.35)]"
              >
                Start Scanning
              </button>
            </div>
          </div>
        )}

        {/* Stop button when scanning */}
        {isScanning && (
          <button
            onClick={stopScanner}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {error && (
        <div className="text-[#e62b1e] text-sm text-center mb-4 p-2 bg-red-50/90 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <div className="text-center text-sm text-zinc-600 font-medium">
        Aim the camera at the attendee's QR code for scanning
      </div>
    </div>
  );
};

export default QRScanner;