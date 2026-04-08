import Papa from 'papaparse';
import { Attendee, ScanResult } from '../types';

let attendeeMap: Map<string, Attendee> = new Map();
let checkedInIds: Set<string> = new Set();

const normalizeAttendeeId = (value: string) => value.trim().toUpperCase();

const extractIdFromValue = (value: string): string | null => {
    const trimmed = value?.trim();
    if (!trimmed) {
        return null;
    }

    // Handles values like: https://api.qrserver.com/...&data=251B077
    const dataParamMatch = trimmed.match(/[?&]data=([^&]+)/i);
    if (dataParamMatch?.[1]) {
        return normalizeAttendeeId(decodeURIComponent(dataParamMatch[1]));
    }

    return normalizeAttendeeId(trimmed);
};

const extractAttendeeIdFromRow = (row: string[]): string | null => {
    // Supports both CSV styles in this repo:
    // - tedx26.csv: enrollment at index 3
    // - final/allattendees.csv: id at index 0 (and sometimes URLs in other columns)
    const candidates = [row?.[3], row?.[0], row?.[1]];

    for (const candidate of candidates) {
        if (!candidate) {
            continue;
        }

        const extracted = extractIdFromValue(candidate);
        if (extracted) {
            return extracted;
        }
    }

    return null;
};

export const loadAttendeesFromCsv = async (csvPath: string): Promise<Attendee[]> => {
    const response = await fetch(csvPath);
    if (!response.ok) {
        throw new Error(`Failed to load attendee CSV: ${response.status}`);
    }

    const csvText = await response.text();

    const parsed = Papa.parse<string[]>(csvText, {
        header: false,
        skipEmptyLines: true,
    });

    const attendees: Attendee[] = [];

    for (const row of parsed.data) {
        const id = extractAttendeeIdFromRow(row);
        if (!id) {
            continue;
        }

        attendees.push({
            id,
            ticketType: 'Standard',
            isCheckedIn: false,
        });
    }

    if (attendees.length === 0) {
        throw new Error(`No attendee IDs found in CSV: ${csvPath}`);
    }

    return attendees;
};

export const initializeAttendees = (attendees: Attendee[]) => {
    attendeeMap = new Map(attendees.map((attendee) => [attendee.id, attendee]));
    checkedInIds = new Set();
};

export const restoreCheckInsFromHistory = (history: ScanResult[]) => {
    checkedInIds = new Set();

    for (const scan of history) {
        if (!scan?.isValid) {
            continue;
        }

        const normalizedId = normalizeAttendeeId(scan.attendeeId);
        const attendee = attendeeMap.get(normalizedId);
        if (!attendee) {
            continue;
        }

        checkedInIds.add(normalizedId);
        attendeeMap.set(normalizedId, {
            ...attendee,
            isCheckedIn: true,
            checkInTime: scan.timestamp ? new Date(scan.timestamp) : attendee.checkInTime,
        });
    }
};

export const validateAttendee = (scannedId: string): ScanResult => {
    const normalizedId = normalizeAttendeeId(scannedId);

    if (attendeeMap.size === 0) {
        return {
            attendeeId: normalizedId,
            timestamp: new Date(),
            isValid: false,
            message: 'Attendee list is not loaded yet. Please wait and try again.',
        };
    }

    const attendee = attendeeMap.get(normalizedId);

    if (!attendee) {
        return {
            attendeeId: normalizedId,
            timestamp: new Date(),
            isValid: false,
            message: 'Invalid attendee ID. This person is not registered.',
        };
    }

    if (checkedInIds.has(normalizedId)) {
        return {
            attendeeId: normalizedId,
            timestamp: new Date(),
            isValid: false,
            attendee,
            message: 'This attendee has already checked in.',
        };
    }

    const updatedAttendee: Attendee = {
        ...attendee,
        isCheckedIn: true,
        checkInTime: new Date(),
    };

    attendeeMap.set(normalizedId, updatedAttendee);
    checkedInIds.add(normalizedId);

    return {
        attendeeId: normalizedId,
        timestamp: new Date(),
        isValid: true,
        attendee: updatedAttendee,
        message: 'Check-in successful!',
    };
};

export const resetAllCheckIns = () => {
    checkedInIds = new Set();
    attendeeMap = new Map(
        Array.from(attendeeMap.entries()).map(([id, attendee]) => [
            id,
            {
                ...attendee,
                isCheckedIn: false,
                checkInTime: undefined,
            },
        ])
    );
};
