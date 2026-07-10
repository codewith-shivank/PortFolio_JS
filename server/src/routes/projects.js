import express from 'express';
import Project from '../models/Project.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/projects
 * @desc    Get all projects (sorted by order)
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private/Admin
 */
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project
 * @access  Private/Admin
 */
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.id || req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      res.status(404);
      return next(new Error('Project not found'));
    }
    res.json(project);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.id || req.params.id);
    if (!project) {
      res.status(404);
      return next(new Error('Project not found'));
    }
    res.json({ message: 'Project removed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
