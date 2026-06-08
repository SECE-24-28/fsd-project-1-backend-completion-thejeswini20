import express from 'express';
import Student from '../models/Student.js';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validation.js';
import AppError from '../utils/AppError.js';

const router = express.Router();

// Get all students
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const students = await Student.find();

  res.json({
    success: true,
    data: students,
    count: students.length
  });
}));

// Get student by ID
router.get('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  res.json({
    success: true,
    data: student
  });
}));

// Create student
router.post('/', authMiddleware, asyncHandler(async (req, res, next) => {
  const { name, email, course, joinDate } = req.body;

  if (!name || !email || !course) {
    return next(new AppError('Name, email, and course are required', 400));
  }

  const existingStudent = await Student.findOne({ email });

  if (existingStudent) {
    return next(new AppError('Student email already exists', 409));
  }

  const newStudent = await Student.create({
    name,
    email,
    course,
    joinDate: joinDate || new Date().toISOString().split('T')[0],
    status: 'active'
  });

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: newStudent
  });
}));

// Update student
router.put('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const updated = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updated) {
    return next(new AppError('Student not found', 404));
  }

  res.json({
    success: true,
    message: 'Student updated successfully',
    data: updated
  });
}));

// Delete student
router.delete('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const deleted = await Student.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return next(new AppError('Student not found', 404));
  }

  res.json({
    success: true,
    message: 'Student deleted successfully'
  });
}));

export default router;
