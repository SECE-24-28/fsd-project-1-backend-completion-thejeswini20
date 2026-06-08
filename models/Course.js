import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      default: '12 weeks'
    },
    maxStudents: {
      type: Number,
      default: 20
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Course', courseSchema);
