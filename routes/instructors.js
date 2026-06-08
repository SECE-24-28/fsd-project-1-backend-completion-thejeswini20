import express from 'express';
import Instructor from '../models/Instructor.js';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validation.js';
import AppError from '../utils/AppError.js';

const router = express.Router();

// Get all instructors
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const instructors = await Instructor.find();

  res.json({
    success: true,
    data: instructors,
    count: instructors.length
  });
}));

// Get instructor by ID
router.get('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const instructor = await Instructor.findById(req.params.id);

  if (!instructor) {
    return next(new AppError('Instructor not found', 404));
  }

  res.json({
    success: true,
    data: instructor
  });
}));

// Create instructor
router.post('/', authMiddleware, asyncHandler(async (req, res, next) => {
  const { name, specialization, experience, phone } = req.body;

  if (!name || !specialization) {
    return next(new AppError('Name and specialization are required', 400));
  }

  const newInstructor = await Instructor.create({
    name,
    specialization,
    experience: experience || 0,
    phone: phone || ''
  });

  res.status(201).json({
    success: true,
    message: 'Instructor created successfully',
    data: newInstructor
  });
}));

// Update instructor
router.put('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const updated = await Instructor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updated) {
    return next(new AppError('Instructor not found', 404));
  }

  res.json({
    success: true,
    message: 'Instructor updated successfully',
    data: updated
  });
}));

// Delete instructor
router.delete('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const deleted = await Instructor.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return next(new AppError('Instructor not found', 404));
  }

  res.json({
    success: true,
    message: 'Instructor deleted successfully'
  });
}));

export default router;
