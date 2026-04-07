// routes/leaveRoutes.js - Leave Management Routes
const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const User = require('../models/User');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// @route   POST /api/leaves/apply
// @desc    Student applies for leave
// @access  Private (Student only)
router.post('/apply', protect, authorizeRoles('student'), async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate dates
    const from = new Date(fromDate);
    const to = new Date(toDate);
    if (from > to) {
      return res.status(400).json({ message: 'From date cannot be after To date' });
    }

    const leave = await Leave.create({
      userId: req.user._id,
      leaveType,
      fromDate: from,
      toDate: to,
      reason,
      status: 'pending',
      currentLevel: 'teacher', // First goes to teacher
    });

    res.status(201).json({ message: 'Leave applied successfully', leave });
  } catch (error) {
    console.error('Apply Leave Error:', error);
    res.status(500).json({ message: 'Server error while applying leave' });
  }
});

// @route   GET /api/leaves/my
// @desc    Get current student's leave history
// @access  Private (Student only)
router.get('/my', protect, authorizeRoles('student'), async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    console.error('Get My Leaves Error:', error);
    res.status(500).json({ message: 'Server error while fetching leaves' });
  }
});

// @route   GET /api/leaves/pending
// @desc    Get pending leaves based on role
// @access  Private (Teacher, HOD, Principal)
router.get('/pending', protect, authorizeRoles('teacher', 'hod', 'principal'), async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'teacher') {
      // Teacher sees leaves at teacher level
      query = { currentLevel: 'teacher', status: 'pending' };
    } else if (req.user.role === 'hod') {
      // HOD sees teacher-approved leaves
      query = { currentLevel: 'hod', status: 'teacher_approved' };
    } else if (req.user.role === 'principal') {
      // Principal sees HOD-approved leaves
      query = { currentLevel: 'principal', status: 'hod_approved' };
    }

    const leaves = await Leave.find(query)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    console.error('Get Pending Leaves Error:', error);
    res.status(500).json({ message: 'Server error while fetching pending leaves' });
  }
});

// Removed admin routes

// @route   GET /api/leaves/approved
// @desc    Get leaves approved by the current role
// @access  Private (Teacher, HOD, Principal)
router.get('/approved', protect, authorizeRoles('teacher', 'hod', 'principal'), async (req, res) => {
  try {
    const roleStatusMap = {
      teacher: ['teacher_approved', 'hod_approved', 'approved'],
      hod: ['hod_approved', 'approved'],
      principal: ['approved'],
    };
    const leaves = await Leave.find({ status: { $in: roleStatusMap[req.user.role] } })
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching approved leaves' });
  }
});

// @route   PUT /api/leaves/update/:id
// @desc    Approve or Reject a leave (role-based)
// @access  Private (Teacher, HOD, Principal)
router.put('/update/:id', protect, authorizeRoles('teacher', 'hod', 'principal'), async (req, res) => {
  try {
    const { action, rejectionReason } = req.body; // action: 'approve' or 'reject'

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    // Validate that the correct role is acting at the correct level
    const roleToLevel = {
      teacher: 'teacher',
      hod: 'hod',
      principal: 'principal',
    };

    if (leave.currentLevel !== roleToLevel[req.user.role]) {
      return res.status(403).json({
        message: `This leave is not at your approval level. Current level: ${leave.currentLevel}`,
      });
    }

    if (action === 'reject') {
      // Any level can reject
      leave.status = 'rejected';
      leave.currentLevel = 'completed';
      leave.rejectionReason = rejectionReason || 'Rejected by approver';
    } else if (action === 'approve') {
      // Approval flow: Teacher → HOD → Principal → Final
      if (req.user.role === 'teacher') {
        leave.status = 'teacher_approved';
        leave.currentLevel = 'hod'; // Move to HOD
      } else if (req.user.role === 'hod') {
        leave.status = 'hod_approved';
        leave.currentLevel = 'principal'; // Move to Principal
      } else if (req.user.role === 'principal') {
        leave.status = 'approved'; // Final approval
        leave.currentLevel = 'completed';
      }
    }

    await leave.save();

    res.json({
      message: `Leave ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      leave,
    });
  } catch (error) {
    console.error('Update Leave Error:', error);
    res.status(500).json({ message: 'Server error while updating leave' });
  }
});

module.exports = router;
