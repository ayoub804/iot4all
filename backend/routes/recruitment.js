const express = require('express');
const router = express.Router();
const { apply, getApplications, updateStatus, getStats } = require('../controllers/recruitmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', apply);      // public
router.get('/', protect, authorize('Admin', 'Supervisor', 'Founder Supervisor'), getApplications);
router.get('/stats', protect, authorize('Admin', 'Supervisor', 'Founder Supervisor'), getStats);
router.patch('/:id', protect, authorize('Admin', 'Supervisor', 'Founder Supervisor'), updateStatus);

module.exports = router;
