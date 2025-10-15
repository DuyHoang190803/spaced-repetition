const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'spaced_repetition_db';

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const notes = db.collection('notes');

  await notes.deleteMany({});

  const now = new Date();
  const sample = [
    {
      title: 'React',
      content: 'DOM',
      currentPosition: '0m',
      reviewCount: 0,
      nextReviewTime: new Date(now.getTime() + 20 * 60 * 1000).toISOString(),
      createdAt: now.toISOString()
    }
  ];

  await notes.insertMany(sample);
  console.log('BE seeded notes');
  await client.close();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
