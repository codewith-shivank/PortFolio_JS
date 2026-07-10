import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/testimonials
 * @desc    Get all testimonials
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/testimonials
 * @desc    Create a new testimonial
 * @access  Private/Admin
 */
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/testimonials/:id
 * @desc    Update testimonial
 * @access  Private/Admin
 */
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.id || req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) {
      res.status(404);
      return next(new Error('Testimonial not found'));
    }
    res.json(testimonial);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/testimonials/:id
 * @desc    Delete testimonial
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.id || req.params.id);
    if (!testimonial) {
      res.status(404);
      return next(new Error('Testimonial not found'));
    }
    res.json({ message: 'Testimonial removed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
