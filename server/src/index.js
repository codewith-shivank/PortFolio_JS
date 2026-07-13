import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables first
dotenv.config();

// ─── Critical Environment Validation ─────────────────────────────────────────
if (!process.env.JWT_SECRET) {
  console.warn(
    '\x1b[33m[WARN] JWT_SECRET is not set in environment. Using insecure default. ' +
    'Set JWT_SECRET in your .env file before deploying!\x1b[0m'
  );
}

if (!process.env.MONGO_URI) {
  console.warn('\x1b[33m[WARN] MONGO_URI is not set. Database connection may fail.\x1b[0m');
}

// Connect to Database
connectDB();

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'https://codewithshivank.dev',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server (no origin header) and allowlisted browser origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true,
}));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
// Limit body size to 1mb to prevent DoS via large payloads
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Rate Limiters ────────────────────────────────────────────────────────────

// General API limiter (100 req per 15 min)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP. Please try again later.' },
});

// Strict limiter for auth and contact routes (10 req per 15 min — prevents brute force/spam)
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
});

app.use('/api', apiLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import skillRoutes from './routes/skills.js';
import experienceRoutes from './routes/experience.js';
import testimonialRoutes from './routes/testimonials.js';
import contactRoutes from './routes/contact.js';
import resumeRoutes from './routes/resume.js';

app.use('/api/auth', strictLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', strictLimiter, contactRoutes);
app.use('/api/resume', resumeRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
