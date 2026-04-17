const express = require('express');
const router = express.Router();
const { apply, getApplications, updateStatus, getStats, getMyApplication } = require('../controllers/recruitmentController');
const { protect, authorize } = require('../middleware/auth');

// My application (logged-in user)
router.get('/my', protect, getMyApplication);

// Public endpoint - anyone can apply
router.post('/', apply);

// Protected endpoints - admin only
router.get('/', protect, authorize('Admin', 'Supervisor', 'Founder Supervisor'), getApplications);
router.get('/stats', protect, authorize('Admin', 'Supervisor', 'Founder Supervisor'), getStats);
router.patch('/:id', protect, authorize('Admin', 'Supervisor', 'Founder Supervisor'), updateStatus);

module.exports = router;
