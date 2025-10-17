
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_URI } = process.env;

// Use a single MONGODB_URI environment variable. Do not assemble or log full URIs in code.
if (!MONGODB_URI) {
    throw new Error('No MongoDB connection string found. Set MONGODB_URI in .env');
}

const connectString = MONGODB_URI;

let isConnected = false;

export async function connectToDatabase() {
    if (isConnected) return mongoose;
    try {
        await mongoose.connect(connectString, { maxPoolSize: 50 });
        isConnected = true;
        // Log the database name connected to
        try {
            const dbName = mongoose.connection?.db?.databaseName || process.env.MONGO_DB || process.env.MONGODB_DB || '';
            console.log(`Connected to MongoDB Database: ${dbName}`);
        } catch (e) { }
        return mongoose;
    } catch (err) {
        throw err;
    }
}

export function getMongooseDb() {
    if (!mongoose.connection || !mongoose.connection.db) throw new Error('Mongoose not connected yet. Call connectToDatabase() first.');
    return mongoose.connection.db;
}

export default mongoose;
