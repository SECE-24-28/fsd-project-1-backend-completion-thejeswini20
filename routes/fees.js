import express from 'express';
import Fee from '../models/Fee.js';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validation.js';
import AppError from '../utils/AppError.js';

const router = express.Router();

// Get all fee records
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const fees = await Fee.find();

  res.json({
    success: true,
    data: fees,
    count: fees.length
  });
}));

// Get fee by ID
router.get('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const fee = await Fee.findById(req.params.id);

  if (!fee) {
    return next(new AppError('Fee record not found', 404));
  }

  res.json({
    success: true,
    data: fee
  });
}));

// Create fee
router.post('/', authMiddleware, asyncHandler(async (req, res, next) => {
  const { studentId, amount, dueDate, status } = req.body;

  if (!studentId || !amount) {
    return next(new AppError('Student ID and amount are required', 400));
  }

  const newFee = await Fee.create({
    studentId,
    amount,
    dueDate: dueDate || new Date().toISOString().split('T')[0],
    status: status || 'Pending'
  });

  res.status(201).json({
    success: true,
    message: 'Fee record created successfully',
    data: newFee
  });
}));

// Update fee
router.put('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const updated = await Fee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updated) {
    return next(new AppError('Fee record not found', 404));
  }

  res.json({
    success: true,
    message: 'Fee record updated successfully',
    data: updated
  });
}));

// Delete fee
router.delete('/:id', authMiddleware, asyncHandler(async (req, res, next) => {
  const deleted = await Fee.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return next(new AppError('Fee record not found', 404));
  }

  res.json({
    success: true,
    message: 'Fee record deleted successfully'
  });
}));

export default router;
