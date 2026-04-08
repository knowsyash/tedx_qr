import { ScanResult } from '../types';

interface DbCheckin {
  attendeeId: string;
  timestamp: string;
}

const CHECKINS_ENDPOINT = '/api/checkins';

const normalizeId = (value: string) => value.trim().toUpperCase();

const extractErrorMessage = async (response: Response): Promise<string> => {
  try {
    const payload = await response.json();
    if (payload?.message) {
      return String(payload.message);
    }
  } catch {
    // ignore JSON parse errors and fallback to status text
  }

  return `${response.status} ${response.statusText}`.trim();
};

export const fetchCheckInsFromDb = async (): Promise<ScanResult[]> => {
  const response = await fetch(CHECKINS_ENDPOINT);
  if (!response.ok) {
    const details = await extractErrorMessage(response);
    throw new Error(`Failed to fetch check-ins from DB: ${details}`);
  }

  const payload = await response.json();
  const checkins = Array.isArray(payload?.checkins) ? (payload.checkins as DbCheckin[]) : [];

  return checkins.map((item) => ({
    attendeeId: normalizeId(item.attendeeId),
    timestamp: new Date(item.timestamp),
    isValid: true,
    message: 'Check-in successful!',
  }));
};

export const saveCheckInToDb = async (scanResult: ScanResult): Promise<void> => {
  if (!scanResult?.isValid) {
    return;
  }

  const response = await fetch(CHECKINS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      attendeeId: normalizeId(scanResult.attendeeId),
      timestamp: scanResult.timestamp,
    }),
  });

  if (!response.ok) {
    const details = await extractErrorMessage(response);
    throw new Error(`Failed to save check-in to DB: ${details}`);
  }
};

export const clearAllDbCheckIns = async (): Promise<void> => {
  const response = await fetch(CHECKINS_ENDPOINT, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const details = await extractErrorMessage(response);
    throw new Error(`Failed to clear DB check-ins: ${details}`);
  }
};
