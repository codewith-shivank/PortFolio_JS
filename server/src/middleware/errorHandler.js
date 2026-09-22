/**
 * Centralized Express Error Handling Middleware
 * - Strips stack traces in production
 * - Returns consistent JSON error shape
 */
const errorHandler = (err, req, res, next) => {
  if (
    err.name === 'MongooseError' ||
    err.name === 'MongoNetworkError' ||
    (err.message && err.message.includes('buffering timed out')) ||
    (err.message && err.message.includes('before initial connection'))
  ) {
    console.warn('[AI Studio] Database offline — returning mock response');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
    }
    return res.status(503).json({ success: false, error: 'Service temporarily unavailable (database offline)' });
  }

  // Log full error in development only
  if (process.env.NODE_ENV !== 'production') {
    console.error('\x1b[31m[ERROR]\x1b[0m', err.stack || err.message);
  } else {
    console.error(`[ERROR] ${err.message}`);
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only include stack trace in non-production environments
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export default errorHandler;
