const Badge = require('../models/Badge');
const User = require('../models/User');

// GET all badges
exports.getBadges = async (req, res) => {
    try {
        const badges = await Badge.find().sort({ createdAt: -1 });
        res.json({ badges });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST add badge to user
exports.addBadgeToUser = async (req, res) => {
    try {
        const { userId, badgeId } = req.body;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const badge = await Badge.findById(badgeId);
        if (!badge) return res.status(404).json({ message: 'Badge not found' });
        
        if (user.badges.includes(badgeId)) {
            return res.status(400).json({ message: 'User already has this badge' });
        }
        
        user.badges.push(badgeId);
        await user.save();
        await user.populate('badges');
        
        res.json({ message: 'Badge added successfully', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE remove badge from user
exports.removeBadgeFromUser = async (req, res) => {
    try {
        const { userId, badgeId } = req.body;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { badges: badgeId } },
            { new: true }
        ).populate('badges');
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json({ message: 'Badge removed successfully', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get user badges
exports.getUserBadges = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('badges');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ badges: user.badges });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
