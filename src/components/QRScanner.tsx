import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Scan, X } from 'lucide-react';
//@ts-ignore
import Papa from 'papaparse';

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


  const [validIds, setValidIds] = useState([]);

  useEffect(() => {
    fetch('/allattendees.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: false, // don't treat first row as header
          skipEmptyLines: true,
          //@ts-ignore
          complete: function (results) {
            const data = results.data;
            // Skip header row, then extract only the first column (index 0)
            //@ts-ignore
            const ids = data.slice(1).map(row => row[0].trim());
            setValidIds(ids);
           
          },
          //@ts-ignore
          error: function (error) {
            console.error('Error parsing CSV:', error);
          }
        });
      });
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
        className="relative mx-auto rounded-lg overflow-hidden bg-black bg-opacity-5 border-2 border-[#e62b1e] mb-4"
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <div className="text-white text-center px-4">
              <Scan size={48} className="mx-auto mb-4 text-[#e62b1e]" />
              <h3 className="text-xl font-semibold mb-2">QR Scanner</h3>
              <p className="text-sm mb-4">Tap the button below to scan attendee QR codes</p>
              <button
                onClick={startScanner}
                className="bg-[#e62b1e] text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all"
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
        <div className="text-[#e62b1e] text-sm text-center mb-4 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      <div className="text-center text-sm text-gray-500">
        Aim the camera at the attendee's QR code for scanning
      </div>
    </div>
  );
};

export default QRScanner;