import React, { useEffect } from 'react';
import { Check, X, User, Clock, Ticket } from 'lucide-react';
import { ScanResult } from '../types';

interface AttendeeValidationProps {
  scanResult: ScanResult | null;
  onReset: ()=>void;
}

const AttendeeValidation: React.FC<AttendeeValidationProps> = ({ scanResult, onReset }) => {
  if (!scanResult) return null;

  const { isValid, attendee, message } = scanResult;
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  useEffect(()=>{
    setTimeout(()=>{
      //@ts-ignore
      onReset();

    },3000)
  },[])
  
  return (
    <div className={`rounded-lg border-2 p-5 mb-6 transform transition-all duration-500 ${
      isValid 
        ? 'border-green-500 bg-green-50' 
        : 'border-[#e62b1e] bg-red-50'
    }`}>
      {/* Status Icon and Text */}
      <div className="flex flex-col items-center mb-6">
        <div className={`rounded-full p-6 mb-3 transform scale-100 transition-transform duration-300 ${
          isValid 
            ? 'bg-green-100 text-green-600' 
            : 'bg-red-100 text-[#e62b1e]'
        }`}>
          {isValid ? <Check size={48} strokeWidth={3} /> : <X size={48} strokeWidth={3} />}
        </div>
        <div className={`text-2xl font-bold ${
          isValid ? 'text-green-600' : 'text-[#e62b1e]'
        }`}>
          {isValid ? 'Verified' : 'Not Verified'}
        </div>
      </div>
      
      {/* Status Message */}
      <p className="text-center text-gray-700 mb-6">{message}</p>
      
      {/* Attendee Details (if available) */}
      {attendee && (
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center mb-3">
            <User size={20} className="text-gray-500 mr-2" />
            <span className="font-semibold">{attendee.id}</span>
          </div>
          
          <div className="flex items-center mb-3">
            <Ticket size={20} className="text-gray-500 mr-2" />
            <span className="font-medium text-gray-700">{attendee.ticketType} Ticket</span>
            <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
              attendee.ticketType === 'VIP' 
                ? 'bg-yellow-100 text-yellow-800' 
                : attendee.ticketType === 'Speaker' 
                  ? 'bg-blue-100 text-blue-800'
                  : attendee.ticketType === 'Organizer'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
            }`}>
              {attendee.ticketType}
            </span>
          </div>
          
          {attendee.checkInTime && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-2" />
              <span>
                Checked in at {formatTime(new Date(attendee.checkInTime))} on {formatDate(new Date(attendee.checkInTime))}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all"
        >
          Scan Another
        </button>
      </div>
    </div>
  );
};

export default AttendeeValidation;