import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Leave'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
