import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * protect — Protects routes from unauthenticated users
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token signature and expiry
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');

      // Find user and attach to request object (exclude password hash)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      next();
    } catch (error) {
      // Only log in development to avoid leaking token error details in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('[Auth]', error.message);
      }
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token provided'));
  }
};

/**
 * admin — Restricts routes to admin roles only
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    next(new Error('Not authorized as an admin'));
  }
};
