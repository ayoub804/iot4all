const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const { protect, authorize } = require('../middleware/auth');

// GET all badges (public)
router.get('/', badgeController.getBadges);

// GET user's badges
router.get('/user/:userId', badgeController.getUserBadges);

// POST initialize default badges (admin/supervisor only)
router.post('/init', protect, authorize('Admin', 'Supervisor', 'Founder Supervisor'), badgeController.initBadges);

// POST add badge to user (admin/supervisor only)
router.post('/user/add', protect, authorize('Admin', 'Supervisor', 'Founder Supervisor'), badgeController.addBadgeToUser);

// DELETE remove badge from user (admin/supervisor only)
router.delete('/user/remove', protect, authorize('Admin', 'Supervisor', 'Founder Supervisor'), badgeController.removeBadgeFromUser);

module.exports = router;
