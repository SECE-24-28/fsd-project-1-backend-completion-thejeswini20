import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    dueDate: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Overdue'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Fee', feeSchema);
