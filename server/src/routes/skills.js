import express from 'express';
import Skill from '../models/Skill.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/skills
 * @desc    Get all skills
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ category: 1, proficiency: -1 });
    res.json(skills);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/skills
 * @desc    Create a new skill
 * @access  Private/Admin
 */
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/skills/:id
 * @desc    Update a skill
 * @access  Private/Admin
 */
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.id || req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) {
      res.status(404);
      return next(new Error('Skill not found'));
    }
    res.json(skill);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/skills/:id
 * @desc    Delete a skill
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.id || req.params.id);
    if (!skill) {
      res.status(404);
      return next(new Error('Skill not found'));
    }
    res.json({ message: 'Skill removed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
