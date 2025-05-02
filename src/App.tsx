import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import QRScanner from './components/QRScanner';
import AttendeeValidation from './components/AttendeeValidation';
import ManualEntry from './components/ManualEntry';
import ScanHistory from './components/ScanHistory';
import { validateAttendee } from './utils/attendeeService';
import { ScanResult } from './types';

function App() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('scanHistory');
    if (savedHistory) {
      try {
        // Convert string dates back to Date objects
        const parsedHistory = JSON.parse(savedHistory, (key, value) => {
          if (key === 'timestamp' || key === 'checkInTime') {
            return value ? new Date(value) : null;
          }
          return value;
        });
        setScanHistory(parsedHistory);
      } catch (error) {
        console.error('Error parsing scan history:', error);
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
  }, [scanHistory]);

  const handleScan = (scannedId: string) => {
    setIsScanning(false);
    const result = validateAttendee(scannedId);
    setScanResult(result);
    setScanHistory(prev => [result, ...prev]);
  };

  const handleManualEntry = (attendeeId: string) => {
    handleScan(attendeeId);
  };

  const resetScan = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('scanHistory');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col px-4 pb-8 max-w-md mx-auto w-full">
        {isScanning ? (
          <>
            <QRScanner onScanSuccess={handleScan} />
            <ManualEntry onSubmit={handleManualEntry} />
            <ScanHistory history={scanHistory} onClearHistory={clearHistory} />
          </>
        ) : (
          <div className="animate-fadeIn">
            <AttendeeValidation scanResult={scanResult} onReset={resetScan} />
            <ScanHistory history={scanHistory} onClearHistory={clearHistory} />
          </div>
        )}
      </main>
      
      <footer className="bg-black text-white py-3 text-center text-sm">
        <p>© 2025 TEDxJUET</p>
      </footer>
    </div>
  );
}

export default App;