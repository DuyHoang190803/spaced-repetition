import express from 'express';
import cors from 'cors';
import notesRouter from './routes/note.route.js';
import requestLogger from './middleware/requestLogger.js';

export default function createApp() {
  const app = express();

  // Request logging middleware (single reusable module)
  app.use(requestLogger);

  // CORS whitelist: provide CORS_ALLOWED_ORIGINS as a comma-separated list in .env
  const raw = process.env.CORS_ALLOWED_ORIGINS || '';
  const origins = raw.split(',').map(s => s.trim()).filter(Boolean);
  if (origins.length > 0) {
    app.use(cors({
      origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (origins.indexOf(origin) !== -1) return callback(null, true);
        return callback(new Error('Not allowed by CORS'), false);
      }
    }));
  } else {
    // permissive for local development if not configured
    app.use(cors());
  }

  app.use(express.json());

  // Default API root
  app.get('/api', (req, res) => {
    res.json({ message: 'hello world' });
  });

  app.use('/api/notes', notesRouter);

  // health
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

  // 404 handler for unknown routes
  app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Not Found' });
  });

  // centralized error handler (must come after all routes)
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    const statusCode = err && err.statusCode ? err.statusCode : 500;
    res.status(statusCode).json({ status: 'error', message: err && err.message ? err.message : 'Server error' });
  });

  return app;
}
