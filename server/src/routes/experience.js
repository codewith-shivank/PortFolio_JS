import express from 'express';
import Experience from '../models/Experience.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/experience
 * @desc    Get all experience details
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const experience = await Experience.find().sort({ order: 1 });
    res.json(experience);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/experience
 * @desc    Create a new experience entry
 * @access  Private/Admin
 */
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json(experience);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/experience/:id
 * @desc    Update experience entry
 * @access  Private/Admin
 */
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.id || req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!experience) {
      res.status(404);
      return next(new Error('Experience entry not found'));
    }
    res.json(experience);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/experience/:id
 * @desc    Delete experience entry
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.id || req.params.id);
    if (!experience) {
      res.status(404);
      return next(new Error('Experience entry not found'));
    }
    res.json({ message: 'Experience entry removed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
