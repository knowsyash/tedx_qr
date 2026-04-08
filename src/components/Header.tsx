import React from 'react';
import { Database, Menu, RefreshCw, Trash2, X } from 'lucide-react';

interface HeaderProps {
  onFetchFromDb: () => void;
  onClearMongoDb: () => void;
  isDbActionRunning: boolean;
}

const Header: React.FC<HeaderProps> = ({ onFetchFromDb, onClearMongoDb, isDbActionRunning }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleFetch = () => {
    onFetchFromDb();
    setIsMobileMenuOpen(false);
  };

  const handleClear = () => {
    onClearMongoDb();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-zinc-950 via-black to-zinc-900 px-4 py-4 mb-6 shadow-[0_12px_24px_rgba(0,0,0,0.2)]">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-black tracking-tight flex items-center">
              <span className="text-[#e62b1e] mr-1">TEDx</span>
              <span className="text-zinc-100">JUET</span>
            </h1>
            <p className="text-zinc-300 text-sm mt-1">Attendee Check-in System</p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleFetch}
              disabled={isDbActionRunning}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 disabled:opacity-60"
            >
              <RefreshCw size={16} />
              Fetch from DB
            </button>
            <button
              onClick={handleClear}
              disabled={isDbActionRunning}
              className="inline-flex items-center gap-2 rounded-full bg-[#e62b1e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#cc2216] disabled:opacity-60 shadow-[0_8px_16px_rgba(230,43,30,0.25)]"
            >
              <Trash2 size={16} />
              Clear MongoDB
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/25 p-2 text-white"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-4 rounded-lg border border-white/15 bg-zinc-900/80 p-3 md:hidden">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400">
              <Database size={14} />
              Database Actions
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleFetch}
                disabled={isDbActionRunning}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                <RefreshCw size={16} />
                Fetch from DB
              </button>
              <button
                onClick={handleClear}
                disabled={isDbActionRunning}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e62b1e] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                <Trash2 size={16} />
                Clear all MongoDB database
              </button>
            </div>
          </div>
        )}

        {isDbActionRunning && (
          <div className="mt-3 text-xs text-zinc-300">Syncing with MongoDB...</div>
        )}
      </div>
    </header>
  );
};

export default Header;