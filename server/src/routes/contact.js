import express from 'express';
import Contact from '../models/Contact.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Submit a contact form message
 * @access  Public
 */
router.post('/', async (req, res, next) => {
  const { name, email, message, subject } = req.body;

  try {
    // Required field validation
    if (!name || !email || !message) {
      res.status(400);
      return next(new Error('Please fill in all required fields: name, email, and message'));
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      return next(new Error('Please provide a valid email address'));
    }

    // Input length limits to prevent abuse
    if (name.trim().length > 100) {
      res.status(400);
      return next(new Error('Name must be 100 characters or fewer'));
    }
    if (message.trim().length < 10) {
      res.status(400);
      return next(new Error('Message must be at least 10 characters'));
    }
    if (message.trim().length > 5000) {
      res.status(400);
      return next(new Error('Message must be 5000 characters or fewer'));
    }

    const newMessage = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject ? subject.trim().slice(0, 200) : '',
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: { id: newMessage._id },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/contact
 * @desc    Get all contact messages
 * @access  Private/Admin
 */
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/contact/:id/read
 * @desc    Mark message as read
 * @access  Private/Admin
 */
router.put('/:id/read', protect, admin, async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) {
      res.status(404);
      return next(new Error('Message not found'));
    }
    res.json(message);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete a message
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      res.status(404);
      return next(new Error('Message not found'));
    }
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
