import { MongoClient, ObjectId } from 'mongodb';
import { columns } from '../models/notes.model.js';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'spaced_repetition_db';

let client;
async function getDb() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    // ensure indexes on first connect
    try {
      const db = client.db(dbName);
      const coll = db.collection('notes');
      // create indexes: currentPosition, nextReviewTime, createdAt, and text index on title+content
      await coll.createIndexes([
        { key: { currentPosition: 1 }, name: 'idx_currentPosition' },
        { key: { nextReviewTime: 1 }, name: 'idx_nextReviewTime' },
        { key: { createdAt: -1 }, name: 'idx_createdAt' },
        { key: { title: 'text', content: 'text' }, name: 'idx_text_title_content' }
      ]);
    } catch (err) {
      // Index creation failure should not prevent app from starting; log and continue
      console.error('Failed to create indexes for notes collection:', err.message || err);
    }
  }
  return client.db(dbName);
}

// Spaced Repetition Intervals - Based on Scientific Research
// Reference: Murre & Dros (2015), Wozniak SuperMemo, Cepeda et al. (2008)

const intervalMap = {
  // === GIAI ĐOẠN 1: Ngày đầu (Critical Period) ===
  '0m': 20,           // Ôn sau 20 phút
  '20m': 60,          // Ôn sau 1 giờ
  '1h': 540,          // Ôn sau 9 giờ
  '9h': 1440,         // Ôn sau 1 ngày

  // === GIAI ĐOẠN 2: Tuần đầu (Consolidation Period) ===
  '1d': 4320,         // Ôn sau 3 ngày (72h)
  '3d': 10080,        // Ôn sau 7 ngày (1 tuần)

  // === GIAI ĐOẠN 3: Dài hạn (Long-term Retention) ===
  '7d': 23040,        // Ôn sau 16 ngày (~2 tuần)
  '16d': 43200,       // Ôn sau 30 ngày (1 tháng)
  '30d': 86400,       // Ôn sau 60 ngày (2 tháng)
  '60d': 129600,      // Ôn sau 90 ngày (3 tháng)
  '90d': 259200,      // Ôn sau 180 ngày (6 tháng)
  '180d': 525600,     // Ôn sau 365 ngày (1 năm)
};

async function listNotes() {
  const db = await getDb();
  return db.collection('notes').find({}).sort({ createdAt: -1 }).toArray();
}

async function createNote({ title, content }) {
  const db = await getDb();
  const now = new Date();
  const note = {
    title,
    content,
    currentPosition: '0m',
    reviewCount: 0,
    nextReviewTime: new Date(now.getTime() + 20 * 60 * 1000).toISOString(),
    createdAt: now.toISOString()
  };
  const res = await db.collection('notes').insertOne(note);
  return { _id: res.insertedId, ...note };
}

async function moveNote({ id, targetPosition }) {
  const db = await getDb();
  const collection = db.collection('notes');
  const note = await collection.findOne({ _id: new ObjectId(id) });
  if (!note) throw new Error('Note not found');

  const currentIndex = columns.indexOf(note.currentPosition);
  const targetIndex = columns.indexOf(targetPosition);
  if (currentIndex === -1 || targetIndex === -1) throw new Error('Invalid column');

  const isMovingForward = targetIndex > currentIndex;
  const isNextColumn = targetIndex === currentIndex + 1;
  if (isMovingForward && !isNextColumn) throw new Error('Can only move forward to next column');

  const now = new Date();
  const reviewCount = isMovingForward ? (note.reviewCount || 0) + 1 : (note.reviewCount || 0);
  const incrementMinutes = intervalMap[targetPosition];
  const nextReview = incrementMinutes ? new Date(now.getTime() + incrementMinutes * 60 * 1000).toISOString() : null;

  await collection.updateOne({ _id: note._id }, { $set: { currentPosition: targetPosition, reviewCount, nextReviewTime: nextReview } });
  return collection.findOne({ _id: note._id });
}

async function updateNote(id, updates) {
  const db = await getDb();
  const collection = db.collection('notes');
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  // Only set allowed fields
  const allowed = ['title', 'content', 'currentPosition', 'reviewCount', 'nextReviewTime'];
  const setObj = {};

  // If currentPosition is being changed, apply move rules (increment reviewCount only when moving forward to next column)
  if (updates.currentPosition && updates.currentPosition !== doc.currentPosition) {
    const currentIndex = columns.indexOf(doc.currentPosition);
    const targetIndex = columns.indexOf(updates.currentPosition);
    if (currentIndex === -1 || targetIndex === -1) throw new Error('Invalid column');

    const isMovingForward = targetIndex > currentIndex;
    const isNextColumn = targetIndex === currentIndex + 1;
    if (isMovingForward && !isNextColumn) throw new Error('Can only move forward to next column');

    const now = new Date();
    const reviewCount = isMovingForward ? (doc.reviewCount || 0) + 1 : (doc.reviewCount || 0);
    const incrementMinutes = intervalMap[updates.currentPosition];
    const nextReview = incrementMinutes ? new Date(now.getTime() + incrementMinutes * 60 * 1000).toISOString() : null;

    // apply the computed move fields
    setObj.currentPosition = updates.currentPosition;
    setObj.reviewCount = reviewCount;
    setObj.nextReviewTime = nextReview;
  }

  // copy other allowed fields (title/content/nextReviewTime if provided explicitly)
  for (const key of Object.keys(updates)) {
    if (allowed.includes(key) && key !== 'currentPosition') {
      // don't overwrite move-computed fields above unless explicitly provided
      if (!(key in setObj)) setObj[key] = updates[key];
    }
  }

  if (Object.keys(setObj).length === 0) return collection.findOne({ _id: doc._id });
  await collection.updateOne({ _id: doc._id }, { $set: setObj });
  return collection.findOne({ _id: doc._id });
}

export { listNotes, createNote, moveNote };
// additional helpers
async function getNoteById(id) {
  const db = await getDb();
  const doc = await db.collection('notes').findOne({ _id: new ObjectId(id) });
  return doc || null;
}

async function deleteNote(id) {
  const db = await getDb();
  const res = await db.collection('notes').deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount === 1;
}

export { getNoteById, deleteNote };
export { updateNote };
