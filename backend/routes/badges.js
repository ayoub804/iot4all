const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');
const { protect, authorize } = require('../middleware/auth');

// GET all badges (public)
router.get('/', badgeController.getBadges);

// GET user's badges
router.get('/user/:userId', badgeController.getUserBadges);

// POST add badge to user (admin only)
router.post('/user/add', protect, authorize('Admin'), badgeController.addBadgeToUser);

// DELETE remove badge from user (admin only)
router.delete('/user/remove', protect, authorize('Admin'), badgeController.removeBadgeFromUser);

module.exports = router;
