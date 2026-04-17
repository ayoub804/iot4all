const User = require('../models/User');

// GET /api/members
exports.getMembers = async (req, res) => {
    try {
        const members = await User.find({ status: { $ne: 'Pending' } }).select('-password').populate('badges');
        res.json({ members });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/members/:id
exports.getMember = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('badges');
        if (!user) return res.status(404).json({ message: 'Member not found' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/members/:id  (Admin only)
exports.updateMember = async (req, res) => {
    try {
        const updates = {};
        ['name', 'role', 'field', 'skills', 'status', 'bio', 'avatar'].forEach(f => {
            if (req.body[f] !== undefined) updates[f] = req.body[f];
        });
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!user) return res.status(404).json({ message: 'Member not found' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/members/:id  (Admin only)
exports.deleteMember = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Member removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
