const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ['Admin', 'Founder Supervisor', 'Founder Member', 'Supervisor', 'Member'],
        default: 'Member'
    },
    field: { type: String, default: '' },
    skills: [{ type: String }],
    status: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Pending' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (entered) {
    return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', UserSchema);
