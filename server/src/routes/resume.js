import express from 'express';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// In-memory download counter (persists per server restart)
// For a production app, persist this to MongoDB
let downloadCount = 0;
const downloadLog = [];

/**
 * @route   POST /api/resume/download
 * @desc    Track a resume download event
 * @access  Public
 */
router.post('/download', async (req, res) => {
  downloadCount++;
  downloadLog.push({
    timestamp: new Date(),
    ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'] || '',
  });

  res.status(200).json({
    success: true,
    message: 'Download tracked',
    totalDownloads: downloadCount,
  });
});

/**
 * @route   GET /api/resume/stats
 * @desc    Get resume download statistics
 * @access  Private/Admin
 */
router.get('/stats', protect, admin, (req, res) => {
  res.json({
    totalDownloads: downloadCount,
    recentDownloads: downloadLog.slice(-20), // last 20 downloads
  });
});

export default router;
