// createIndexes.js
// Run this script in the BE folder to create indexes on the `notes` collection.

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'spaced_repetition_db';

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const coll = db.collection('notes');

    console.log('Creating indexes on notes collection...');
    const result = await coll.createIndexes([
      { key: { currentPosition: 1 }, name: 'idx_currentPosition' },
      { key: { nextReviewTime: 1 }, name: 'idx_nextReviewTime' },
      { key: { createdAt: -1 }, name: 'idx_createdAt' },
      { key: { title: 'text', content: 'text' }, name: 'idx_text_title_content' }
    ]);

    console.log('Indexes created:', result);
  } catch (err) {
    console.error('Failed to create indexes:', err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run();
