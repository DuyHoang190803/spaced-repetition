import dotenv from 'dotenv';
import createApp from './app.js';
import { connectToDatabase } from './database/connect.mongodb.js';

dotenv.config();

const port = process.env.PORT || 3000;
const app = createApp();

async function start() {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error('Failed to connect to DB. Exiting. Error:', err.message || err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`BE listening on http://localhost:${port}`);
  });
}

start();
