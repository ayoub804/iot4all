const express = require('express');
const router = express.Router();
const { getMembers, getMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getMembers);
router.get('/:id', protect, getMember);
router.put('/:id', protect, authorize('Admin'), updateMember);
router.delete('/:id', protect, authorize('Admin'), deleteMember);

module.exports = router;
