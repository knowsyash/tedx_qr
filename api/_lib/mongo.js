import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'tedx_qr';

let cached = globalThis.__mongoCache;

if (!cached) {
  cached = globalThis.__mongoCache = { client: null, clientPromise: null };
}

async function getMongoClient() {
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable.');
  }

  if (cached.clientPromise) {
    return cached.clientPromise;
  }

  const client = new MongoClient(uri);
  cached.client = client;
  cached.clientPromise = client.connect();
  return cached.clientPromise;
}

export async function getCheckinsCollection() {
  const connectedClient = await getMongoClient();
  const db = connectedClient.db(dbName);
  const collection = db.collection('checkins');
  await collection.createIndex({ attendeeId: 1 }, { unique: true });
  return collection;
}
