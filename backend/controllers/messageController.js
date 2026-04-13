const Message = require('../models/Message');

// GET /api/messages/:channel
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ channel: req.params.channel })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('user', 'name avatar role');
        res.json({ messages: messages.reverse() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/messages  (called internally or by socket)
exports.createMessage = async (msg) => {
    return await Message.create(msg);
};
