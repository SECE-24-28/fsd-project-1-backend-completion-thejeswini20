import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/validation.js';
import AppError from '../utils/AppError.js';

const router = express.Router();

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    secret,
    {
      expiresIn: '24h'
    }
  );
};

// LOGIN
router.post('/login', asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password required', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
}));

// REGISTER
router.post('/register', asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password required', 400));
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError('Email already registered', 409));
  }

  if (password.length < 6) {
    return next(
      new AppError(
        'Password must be at least 6 characters',
        400
      )
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name: name || email.split('@')[0],
    email,
    password: hashedPassword,
    role: 'user'
  });

  const token = generateToken(newUser);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    }
  });
}));

// VERIFY TOKEN
router.get('/verify', (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new AppError('No token provided', 401));
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return next(
        new AppError(
          'Server configuration error',
          500
        )
      );
    }

    const decoded = jwt.verify(token, secret);

    res.json({
      success: true,
      data: decoded
    });

  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
});

export default router;
