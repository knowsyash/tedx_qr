import { useState, useEffect } from 'react';
import Header from './components/Header';
import QRScanner from './components/QRScanner';
import AttendeeValidation from './components/AttendeeValidation';
import ManualEntry from './components/ManualEntry';
import ScanHistory from './components/ScanHistory';
import {
  initializeAttendees,
  loadAttendeesFromCsv,
  resetAllCheckIns,
  restoreCheckInsFromHistory,
  validateAttendee,
} from './utils/attendeeService.ts';
import { ScanResult } from './types';

const parseSavedHistory = (): ScanResult[] => {
  const savedHistory = localStorage.getItem('scanHistory');
  if (!savedHistory) {
    return [];
  }

  try {
    return JSON.parse(savedHistory, (key, value) => {
      if (key === 'timestamp' || key === 'checkInTime') {
        return value ? new Date(value) : null;
      }
      return value;
    });
  } catch (error) {
    console.error('Error parsing scan history:', error);
    return [];
  }
};

function App() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const bootstrapAttendees = async () => {
      try {
        setIsLoadingAttendees(true);
        const parsedHistory = parseSavedHistory();
        setScanHistory(parsedHistory);

        const candidateCsvPaths = ['/tedx26.csv', '/final.csv', '/allattendees.csv'];
        let loaded = false;

        for (const csvPath of candidateCsvPaths) {
          try {
            const attendees = await loadAttendeesFromCsv(csvPath);
            initializeAttendees(attendees);
            restoreCheckInsFromHistory(parsedHistory);
            loaded = true;
            break;
          } catch {
            // Try the next source.
          }
        }

        if (!loaded) {
          throw new Error('No valid attendee CSV source was found.');
        }

        setLoadError(null);
      } catch (error) {
        console.error('Failed to load attendees:', error);
        setLoadError('Failed to load attendee data from CSV files. Please verify files in public/ and redeploy.');
      } finally {
        setIsLoadingAttendees(false);
      }
    };

    bootstrapAttendees();
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
  }, [scanHistory]);

  const handleScan = (scannedId: string) => {
    setIsScanning(false);
    const result = validateAttendee(scannedId);
    setScanResult(result);
    if (result.isValid === true) {
      setScanHistory(prev => [result, ...prev]);
    }
  };

  const handleManualEntry = (attendeeId: string) => {
    handleScan(attendeeId);
  };

  function resetScan() {
    setScanResult(null);
    setIsScanning(true);
  };

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('scanHistory');
    resetAllCheckIns();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col px-4 pb-8 max-w-md mx-auto w-full">
        {isLoadingAttendees && (
          <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3 text-center text-sm text-gray-600">
            Loading attendee list...
          </div>
        )}
        {loadError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-[#e62b1e]">
            {loadError}
          </div>
        )}
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