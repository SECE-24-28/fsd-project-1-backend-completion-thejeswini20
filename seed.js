import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Models
import User from './models/User.js';
import Student from './models/Student.js';
import Instructor from './models/Instructor.js';
import Course from './models/Course.js';
import Fee from './models/Fee.js';
import Attendance from './models/Attendance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Seed Admin User
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@dance.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Default Admin User created: admin@dance.com / admin123');
    } else {
      console.log('ℹ️ Users already exist. Skipping admin user seed.');
    }

    // 2. Seed Courses
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log('Seeding courses...');
      const coursesData = [
        { name: 'Ballet', level: 'Beginner–Advanced', duration: '60 min', maxStudents: 24 },
        { name: 'Hip-Hop', level: 'Beginner–Intermediate', duration: '60 min', maxStudents: 31 },
        { name: 'Kathak', level: 'All Levels', duration: '75 min', maxStudents: 18 },
        { name: 'Contemporary', level: 'Intermediate–Advanced', duration: '60 min', maxStudents: 22 },
        { name: 'Salsa', level: 'Beginner–Advanced', duration: '55 min', maxStudents: 19 },
        { name: 'Bharatanatyam', level: 'All Levels', duration: '90 min', maxStudents: 16 }
      ];
      await Course.insertMany(coursesData);
      console.log('✅ Courses seeded');
    } else {
      console.log('ℹ️ Courses already exist. Skipping courses seed.');
    }

    // 3. Seed Instructors
    const instructorCount = await Instructor.countDocuments();
    if (instructorCount === 0) {
      console.log('Seeding instructors...');
      const instructorsData = [
        { name: 'Ms. Kavya Reddy', specialization: 'Ballet & Contemporary', experience: 8, phone: '9876543210' },
        { name: 'Mr. Arjun Singh', specialization: 'Hip-Hop & Street Dance', experience: 6, phone: '9876543211' },
        { name: 'Ms. Sunita Rao', specialization: 'Kathak & Bharatanatyam', experience: 12, phone: '9876543212' },
        { name: 'Ms. Elena', specialization: 'Salsa & Latin', experience: 7, phone: '9876543213' },
        { name: 'Mr. Dev Kumar', specialization: 'Contemporary & Jazz', experience: 5, phone: '9876543214' }
      ];
      await Instructor.insertMany(instructorsData);
      console.log('✅ Instructors seeded');
    } else {
      console.log('ℹ️ Instructors already exist. Skipping instructors seed.');
    }

    // 4. Seed Students
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      console.log('Seeding students...');
      const studentsData = [
        { name: 'Aria Sharma', email: 'aria@example.com', course: 'Ballet', joinDate: '2024-01-10', status: 'active' },
        { name: 'Zara Patel', email: 'zara@example.com', course: 'Hip-Hop', joinDate: '2024-02-12', status: 'active' },
        { name: 'Meera Iyer', email: 'meera@example.com', course: 'Kathak', joinDate: '2024-01-15', status: 'active' },
        { name: 'Lily Chen', email: 'lily@example.com', course: 'Contemporary', joinDate: '2024-03-05', status: 'inactive' },
        { name: 'Riya Nair', email: 'riya@example.com', course: 'Salsa', joinDate: '2024-02-20', status: 'active' }
      ];
      await Student.insertMany(studentsData);
      console.log('✅ Students seeded');
    } else {
      console.log('ℹ️ Students already exist. Skipping students seed.');
    }

    // 5. Seed Fees
    const feeCount = await Fee.countDocuments();
    if (feeCount === 0) {
      console.log('Seeding fees...');
      const feesData = [
        { studentId: 1, amount: 3500, dueDate: '2024-05-01', status: 'Paid' },
        { studentId: 2, amount: 3000, dueDate: '2024-05-03', status: 'Paid' },
        { studentId: 3, amount: 3200, dueDate: '2024-05-05', status: 'Pending' },
        { studentId: 4, amount: 2800, dueDate: '2024-05-07', status: 'Overdue' }
      ];
      await Fee.insertMany(feesData);
      console.log('✅ Fees seeded');
    } else {
      console.log('ℹ️ Fees already exist. Skipping fees seed.');
    }

    // 6. Seed Attendance
    const attendanceCount = await Attendance.countDocuments();
    if (attendanceCount === 0) {
      console.log('Seeding attendance...');
      const attendanceData = [
        { studentId: 1, date: '2024-05-01', status: 'Present' },
        { studentId: 2, date: '2024-05-01', status: 'Present' },
        { studentId: 3, date: '2024-05-01', status: 'Present' },
        { studentId: 4, date: '2024-05-01', status: 'Absent' }
      ];
      await Attendance.insertMany(attendanceData);
      console.log('✅ Attendance seeded');
    } else {
      console.log('ℹ️ Attendance already exist. Skipping attendance seed.');
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
