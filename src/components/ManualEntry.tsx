import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface ManualEntryProps {
  onSubmit: (id: string) => void;
}

const ManualEntry: React.FC<ManualEntryProps> = ({ onSubmit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [attendeeId, setAttendeeId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (attendeeId.trim()) {
      onSubmit(attendeeId.trim());
      setAttendeeId('');
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-center text-zinc-700 text-base font-medium mb-2 focus:outline-none"
      >
        {isExpanded ? 'Hide Manual Entry' : 'Manual ID Entry'}
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="flex items-center rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <input
            type="text"
            value={attendeeId}
            onChange={(e) => setAttendeeId(e.target.value)}
            placeholder="Enter attendee ID (e.g., TED001)"
            className="flex-grow px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e62b1e] focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-[#e62b1e] text-white px-4 py-3 hover:bg-opacity-90 transition-all"
          >
            <Search size={20} />
          </button>
        </form>
      )}
    </div>
  );
};

export default ManualEntry;