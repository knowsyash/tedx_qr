import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-black py-4 px-6 mb-6">
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold flex items-center">
            <span className="text-[#e62b1e] mr-1">TEDx</span>
            <span>JUET</span>
          </h1>
          <p className="text-gray-300 text-sm mt-1">Attendee Check-in System</p>
        </div>
      </div>
    </header>
  );
};

export default Header;