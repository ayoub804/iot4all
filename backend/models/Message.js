const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    channel: { type: String, required: true, default: 'general' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
