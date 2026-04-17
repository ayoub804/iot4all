const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '⭐' },
    color: { type: String, default: '#C8F135' },
    generation: { type: String, enum: ['Founder', 'Regular'], default: 'Regular' }
}, { timestamps: true });

module.exports = mongoose.model('Badge', BadgeSchema);
