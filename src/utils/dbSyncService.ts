import { ScanResult } from '../types';

interface DbCheckin {
    attendeeId: string;
    timestamp: string;
}

const CHECKINS_ENDPOINT = '/api/checkins';

const normalizeId = (value: string) => value.trim().toUpperCase();

export const mergeScanHistories = (primary: ScanResult[], secondary: ScanResult[]): ScanResult[] => {
    const byAttendeeId = new Map<string, ScanResult>();

    const push = (entry: ScanResult) => {
        if (!entry?.attendeeId) {
            return;
        }

        const id = normalizeId(entry.attendeeId);
        const current = byAttendeeId.get(id);
        const entryTime = new Date(entry.timestamp).getTime();
        const currentTime = current ? new Date(current.timestamp).getTime() : -1;

        if (!current || entryTime > currentTime) {
            byAttendeeId.set(id, {
                ...entry,
                attendeeId: id,
                isValid: true,
                message: 'Check-in successful!',
            });
        }
    };

    primary.forEach(push);
    secondary.forEach(push);

    return Array.from(byAttendeeId.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
};

export const fetchCheckInsFromDb = async (): Promise<ScanResult[]> => {
    const response = await fetch(CHECKINS_ENDPOINT);
    if (!response.ok) {
        throw new Error(`Failed to fetch check-ins from DB: ${response.status}`);
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
        throw new Error(`Failed to save check-in to DB: ${response.status}`);
    }
};

export const clearAllDbCheckIns = async (): Promise<void> => {
    const response = await fetch(CHECKINS_ENDPOINT, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to clear DB check-ins: ${response.status}`);
    }
};
