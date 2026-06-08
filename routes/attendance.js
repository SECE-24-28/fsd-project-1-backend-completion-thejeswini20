import express from 'express';
import Attendance from '../models/Attendance.js';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validation.js';
import AppError from '../utils/AppError.js';

const router = express.Router();

// Get all attendance records
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const attendance = await Attendance.find();

  res.json({
    success: true,
    data: attendance,
    count: attendance.length
  });
}));

// Get attendance by ID
router.get('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const record = await Attendance.findById(req.params.id);

  if (!record) {
    return next(new AppError('Attendance record not found', 404));
  }

  res.json({
    success: true,
    data: record
  });
}));

// Create attendance
router.post('/', authMiddleware, asyncHandler(async (req, res, next) => {
  const { studentId, date, status } = req.body;

  if (!studentId || !date || !status) {
    return next(new AppError('Student ID, date, and status are required', 400));
  }

  if (!['Present', 'Absent', 'Leave'].includes(status)) {
    return next(new AppError('Invalid status. Must be Present, Absent, or Leave', 400));
  }

  const newRecord = await Attendance.create({
    studentId,
    date,
    status
  });

  res.status(201).json({
    success: true,
    message: 'Attendance record created successfully',
    data: newRecord
  });
}));

// Update attendance
router.put('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const updated = await Attendance.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updated) {
    return next(new AppError('Attendance record not found', 404));
  }

  res.json({
    success: true,
    message: 'Attendance record updated successfully',
    data: updated
  });
}));

// Delete attendance
router.delete('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const deleted = await Attendance.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return next(new AppError('Attendance record not found', 404));
  }

  res.json({
    success: true,
    message: 'Attendance record deleted successfully'
  });
}));

export default router;
