import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    course: {
      type: String,
      required: true
    },

    joinDate: {
      type: String,
      required: true
    },

    status: {
      type: String,
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Student', studentSchema);
