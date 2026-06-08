import express from 'express';
import Course from '../models/Course.js';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validation.js';
import AppError from '../utils/AppError.js';

const router = express.Router();

// Get all courses
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const courses = await Course.find();

  res.json({
    success: true,
    data: courses,
    count: courses.length
  });
}));

// Get course by ID
router.get('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  res.json({
    success: true,
    data: course
  });
}));

// Create course
router.post('/', authMiddleware, asyncHandler(async (req, res, next) => {
  const { name, level, duration, maxStudents } = req.body;

  if (!name || !level) {
    return next(new AppError('Name and level are required', 400));
  }

  const newCourse = await Course.create({
    name,
    level,
    duration: duration || '12 weeks',
    maxStudents: maxStudents || 20
  });

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: newCourse
  });
}));

// Update course
router.put('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const updated = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updated) {
    return next(new AppError('Course not found', 404));
  }

  res.json({
    success: true,
    message: 'Course updated successfully',
    data: updated
  });
}));

// Delete course
router.delete('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const deleted = await Course.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return next(new AppError('Course not found', 404));
  }

  res.json({
    success: true,
    message: 'Course deleted successfully'
  });
}));

export default router;
