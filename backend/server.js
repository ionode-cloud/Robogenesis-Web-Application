import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { initAdminStorage, syncStorageWithDatabase } from './services/storage.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Initialize local admin storage on startup
initAdminStorage();

// Connect to MongoDB Atlas and synchronize data
connectDB().then((connected) => {
  if (connected) {
    syncStorageWithDatabase();
  }
});

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      // Allow localhost and local IP addresses
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      // Allow any Vercel deployment domain
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      // Allow all configured or custom domains
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);
app.options('*', cors());
app.use(express.json());

// Ensure MongoDB connection is initialized for incoming requests
app.use(async (req, res, next) => {
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
    } catch {
      // Handled internally, resilient storage active
    }
  }
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Robogenesis Enterprise Backend API',
    database: process.env.MONGODB_URI ? 'MongoDB Atlas Connected' : 'Local Storage Mode',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Root informational endpoint
app.get('/api', (req, res) => {
  res.json({
    service: 'Robogenesis Robotics API',
    status: 'online',
    endpoints: {
      auth: '/api/auth',
      contact: '/api/contact',
      admin: '/api/admin',
      health: '/api/health',
    },
  });
});

// 404 Handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found on Robogenesis API.' });
});

// Run standalone HTTP server if not in a serverless environment
if (process.env.VERCEL !== '1' && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const server = app.listen(PORT, () => {
    console.log(`Robogenesis Backend Server active on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[Server Error] Port ${PORT} is already in use by another process.`);
    } else {
      console.error('[Server Error]', err.message);
    }
  });

  function gracefulShutdown(signal) {
    server.close(() => {
      process.exit(0);
    });
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export default app;

