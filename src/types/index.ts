export interface Attendee {
  id: string;
 
  ticketType: 'Standard' | 'VIP' | 'Speaker' | 'Organizer';
  checkInTime?: Date;
  isCheckedIn: boolean;
}

export interface ScanResult {
  attendeeId: string;
  timestamp: Date;
  isValid: boolean;
  attendee?: Attendee;
  message: string;
}