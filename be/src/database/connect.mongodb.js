
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const {
  MONGODB_URI,
  MONGO_USER,
  MONGO_PASS,
  MONGO_CLUSTER,
  MONGO_DB,
} = process.env;

// Build connection string: prefer cloud credentials when provided, otherwise use MONGODB_URI
let connectString = '';
let usedSource = 'none';
if (MONGO_USER && MONGO_PASS && MONGO_CLUSTER) {
  connectString = `mongodb+srv://${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(MONGO_PASS)}@${MONGO_CLUSTER}/${MONGO_DB || ''}?retryWrites=true&w=majority`;
  usedSource = 'cloud-credentials';
} else if (MONGODB_URI) {
  connectString = MONGODB_URI;
  usedSource = 'MONGODB_URI';
} else {
  throw new Error('No MongoDB connection info found. Set MONGODB_URI or MONGO_USER/MONGO_PASS/MONGO_CLUSTER in .env');
}

// Mask password for logs
let masked = connectString;
try {
  masked = connectString.replace(/\/\/(.+?):(.+?)@/, (m, user, pass) => `//${user}:***@`);
} catch (e) {}

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
    } catch (e) {}
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
