import { getCheckinsCollection } from './_lib/mongo.js';

function parseJsonBody(req) {
    if (!req.body) {
        return {};
    }

    if (typeof req.body === 'object') {
        return req.body;
    }

    try {
        return JSON.parse(req.body);
    } catch {
        return {};
    }
}

export default async function handler(req, res) {
    try {
        const collection = await getCheckinsCollection();

        if (req.method === 'GET') {
            const docs = await collection.find({}).sort({ timestamp: -1 }).toArray();
            const checkins = docs.map((doc) => ({
                attendeeId: doc.attendeeId,
                timestamp: doc.timestamp,
            }));

            return res.status(200).json({ checkins });
        }

        if (req.method === 'POST') {
            const body = parseJsonBody(req);
            const attendeeId = String(body.attendeeId || '').trim().toUpperCase();

            if (!attendeeId) {
                return res.status(400).json({ message: 'attendeeId is required.' });
            }

            const timestamp = body.timestamp ? new Date(body.timestamp) : new Date();

            await collection.updateOne(
                { attendeeId },
                {
                    $setOnInsert: {
                        attendeeId,
                        timestamp,
                    },
                },
                { upsert: true }
            );

            return res.status(200).json({ message: 'Saved check-in.' });
        }

        if (req.method === 'DELETE') {
            const result = await collection.deleteMany({});
            return res.status(200).json({ deletedCount: result.deletedCount });
        }

        return res.status(405).json({ message: 'Method not allowed.' });
    } catch (error) {
        console.error('checkins API error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}
