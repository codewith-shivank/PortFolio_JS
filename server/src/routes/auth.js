import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey', {
    expiresIn: '30d',
  });
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide email and password'));
    }

    // Check for user (and explicitly select password field since it is hidden by default)
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', protect, async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/register-admin-first-time
 * @desc    Secret first-time helper to register the admin user
 * @access  Public
 */
router.post('/register-admin-first-time', async (req, res, next) => {
  const { name, email, password, secretKey } = req.body;

  try {
    // Basic verification key check to prevent open registrations
    const expectedSecret = process.env.ADMIN_REGISTRATION_SECRET || 'shivank-portfolio-secret-1357';
    if (secretKey !== expectedSecret) {
      res.status(403);
      return next(new Error('Invalid registration secret key'));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
