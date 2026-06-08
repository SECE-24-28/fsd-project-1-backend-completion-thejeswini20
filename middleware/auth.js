import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new AppError('Server configuration error', 500));
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Access denied', 403));
    }

    next();
  };
};
