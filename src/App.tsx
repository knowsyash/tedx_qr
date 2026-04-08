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
import {
  clearAllDbCheckIns,
  fetchCheckInsFromDb,
  saveCheckInToDb,
} from './utils/dbSyncService.ts';

const parseSavedHistory = (): ScanResult[] => {
  if (typeof window === 'undefined') {
    return [];
  }

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
  const [scanHistory, setScanHistory] = useState<ScanResult[]>(() => parseSavedHistory());
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dbActionMessage, setDbActionMessage] = useState<string | null>(null);
  const [isDbActionRunning, setIsDbActionRunning] = useState<boolean>(false);

  const showDbActionMessage = (message: string) => {
    setDbActionMessage(message);
    window.setTimeout(() => {
      setDbActionMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  useEffect(() => {
    const bootstrapAttendees = async () => {
      try {
        setIsLoadingAttendees(true);
        const candidateCsvPaths = ['/tedx26.csv', '/final.csv', '/allattendees.csv'];
        let loaded = false;

        for (const csvPath of candidateCsvPaths) {
          try {
            const attendees = await loadAttendeesFromCsv(csvPath);
            initializeAttendees(attendees);

            let dbHistory: ScanResult[] = [];
            let hasDbHistory = false;
            try {
              dbHistory = await fetchCheckInsFromDb();
              hasDbHistory = true;
            } catch (dbError) {
              console.warn('MongoDB fetch unavailable, continuing with local history only.', dbError);
            }

            const initialHistory = hasDbHistory ? dbHistory : scanHistory;
            setScanHistory(initialHistory);
            restoreCheckInsFromHistory(initialHistory);
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
      saveCheckInToDb(result).catch((error) => {
        console.warn('Failed to sync check-in to MongoDB:', error);
      });
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

  const handleFetchFromDb = async () => {
    try {
      setIsDbActionRunning(true);
      const dbHistory = await fetchCheckInsFromDb();
      setScanHistory(dbHistory);
      restoreCheckInsFromHistory(dbHistory);
      showDbActionMessage('Fetched latest check-ins from MongoDB.');
    } catch (error) {
      console.error('Failed to fetch from DB:', error);
      showDbActionMessage('Failed to fetch from MongoDB. Check API and MONGODB_URI settings.');
    } finally {
      setIsDbActionRunning(false);
    }
  };

  const handleClearMongoDb = async () => {
    const confirmed = window.confirm('Clear all check-ins in MongoDB for all devices?');
    if (!confirmed) {
      return;
    }

    try {
      setIsDbActionRunning(true);
      await clearAllDbCheckIns();
      setScanHistory([]);
      localStorage.removeItem('scanHistory');
      resetAllCheckIns();
      showDbActionMessage('MongoDB check-ins cleared successfully.');
    } catch (error) {
      console.error('Failed to clear MongoDB check-ins:', error);
      showDbActionMessage('Failed to clear MongoDB check-ins.');
    } finally {
      setIsDbActionRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fdf2f2_0%,_#f4f4f5_45%,_#e4e4e7_100%)] flex flex-col">
      <Header
        onFetchFromDb={handleFetchFromDb}
        onClearMongoDb={handleClearMongoDb}
        isDbActionRunning={isDbActionRunning}
      />

      <main className="flex-grow flex flex-col px-4 pb-10 max-w-lg mx-auto w-full">
        {dbActionMessage && (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50/90 p-3 text-center text-sm font-medium text-blue-700 shadow-sm">
            {dbActionMessage}
          </div>
        )}
        {isLoadingAttendees && (
          <div className="mb-4 rounded-xl border border-zinc-200 bg-white/80 p-3 text-center text-sm text-zinc-700 shadow-sm">
            Loading attendee list...
          </div>
        )}
        {loadError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50/90 p-3 text-center text-sm text-[#e62b1e] shadow-sm">
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

      <footer className="mt-auto border-t border-zinc-300/70 bg-zinc-950 text-zinc-100 py-3 text-center text-sm">
        <p>© 2026 TEDxJUET</p>
      </footer>
    </div>
  );
}

export default App;