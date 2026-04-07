// models/Leave.js - Leave Schema
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['Medical', 'Personal', 'Academic', 'Family Emergency', 'Other'],
      required: [true, 'Leave type is required'],
    },
    fromDate: {
      type: Date,
      required: [true, 'From date is required'],
    },
    toDate: {
      type: Date,
      required: [true, 'To date is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    // Approval status tracking
    status: {
      type: String,
      enum: ['pending', 'teacher_approved', 'hod_approved', 'approved', 'rejected'],
      default: 'pending',
    },
    // Current approval level
    currentLevel: {
      type: String,
      enum: ['teacher', 'hod', 'principal', 'completed'],
      default: 'teacher',
    },
    // Rejection reason (optional)
    rejectionReason: {
      type: String,
      default: '',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leave', leaveSchema);
