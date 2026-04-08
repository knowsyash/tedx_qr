import React from 'react';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { ScanResult } from '../types';

interface ScanHistoryProps {
  history: ScanResult[];
  onClearHistory: () => void;
}

const ScanHistory: React.FC<ScanHistoryProps> = ({ history, onClearHistory }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (history.length === 0) return null;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleClearLocalStorage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const confirmed = window.confirm('Clear all saved scan history from this device?');
    if (confirmed) {
      onClearHistory();
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white mb-6 overflow-hidden shadow-sm">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={toggleExpand}
      >
        <h3 className="text-lg font-medium">Verified Scans ({history.length})</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClearLocalStorage}
            className="text-xs font-medium text-[#e62b1e] hover:text-red-700"
          >
            Clear Local Storage
          </button>
          <button className="text-gray-500" aria-label="Toggle scan history">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="max-h-60 overflow-y-auto">
            {history.map((scan, index) => (
              <div
                key={index}
                className={`flex items-center p-3 border-t border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
              >
                <div className={`flex-shrink-0 mr-3 rounded-full p-1.5 ${scan.isValid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-[#e62b1e]'
                  }`}>
                  {scan.isValid ? <Check size={16} /> : <X size={16} />}
                </div>

                <div className="flex-grow">
                  <div className="font-medium">
                    {scan.attendeeId}
                  </div>
                  <div className="text-xs text-gray-500">
                    {scan.message}
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  {formatTime(scan.timestamp)}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200 text-center">
            <button
              onClick={handleClearLocalStorage}
              className="text-sm text-[#e62b1e] hover:text-red-700"
            >
              Clear History
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ScanHistory;