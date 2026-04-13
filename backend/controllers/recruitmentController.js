const Recruitment = require('../models/Recruitment');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// POST /api/recruitment  (public - submit application)
exports.apply = async (req, res) => {
    try {
        const { name, email, field, motivation, skills } = req.body;
        const existing = await Recruitment.findOne({ email, status: 'Pending' });
        if (existing) return res.status(400).json({ message: 'Application already submitted' });
        const app = await Recruitment.create({ name, email, field, motivation, skills });
        res.status(201).json({ message: 'Application submitted successfully', app });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/recruitment  (Admin/Supervisor)
exports.getApplications = async (req, res) => {
    try {
        const apps = await Recruitment.find().sort({ createdAt: -1 }).populate('reviewedBy', 'name');
        res.json({ apps });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/recruitment/:id  (Admin/Supervisor - update status)
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const app = await Recruitment.findByIdAndUpdate(
            req.params.id,
            { status, reviewedBy: req.user.id },
            { new: true }
        );
        if (!app) return res.status(404).json({ message: 'Application not found' });

        // If accepted, auto-create a user account with a temp password
        if (status === 'Accepted') {
            const exists = await User.findOne({ email: app.email });
            if (!exists) {
                await User.create({
                    name: app.name,
                    email: app.email,
                    password: 'TempPass123!',   // user must change on first login
                    field: app.field,
                    skills: app.skills,
                    role: 'Member',
                    status: 'Active'
                });
            }
        }

        res.json({ app });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/recruitment/stats  (Admin)
exports.getStats = async (req, res) => {
    try {
        const total = await Recruitment.countDocuments();
        const pending = await Recruitment.countDocuments({ status: 'Pending' });
        const accepted = await Recruitment.countDocuments({ status: 'Accepted' });
        const rejected = await Recruitment.countDocuments({ status: 'Rejected' });
        res.json({ total, pending, accepted, rejected });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
