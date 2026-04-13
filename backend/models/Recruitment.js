const mongoose = require('mongoose');

const RecruitmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    field: { type: String, required: true },
    motivation: { type: String, default: '' },
    skills: [{ type: String }],
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Recruitment', RecruitmentSchema);
