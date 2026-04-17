const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, field } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered' });

        const user = await User.create({ name, email, password, field, role: 'User', status: 'Active' });
        const token = signToken(user._id);

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status, avatar: user.avatar }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user._id);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, status: user.status, avatar: user.avatar }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id).populate('badges');
    res.json({ user });
};

// PUT /api/auth/me  (profile update)
exports.updateMe = async (req, res) => {
    try {
        const fields = ['name', 'field', 'skills', 'bio', 'avatar'];
        const updates = {};
        fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
