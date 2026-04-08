const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable.');
}

const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    global._mongoClientPromise = global._mongoClientPromise || null;

    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }

    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

async function getCheckinsCollection() {
    const connectedClient = await clientPromise;
    const db = connectedClient.db(process.env.MONGODB_DB || 'tedx_qr');
    const collection = db.collection('checkins');
    await collection.createIndex({ attendeeId: 1 }, { unique: true });
    return collection;
}

module.exports = { getCheckinsCollection };
