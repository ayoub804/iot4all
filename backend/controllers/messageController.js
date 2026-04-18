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
    // If message contains file, check storage limit
    if (msg.fileData) {
        try {
            // Simple approach: Keep total file storage under ~400MB
            // Since we store as Base64 in MongoDB, we can estimate size by string length
            const LIMIT_BYTES = 400 * 1024 * 1024; // 400MB
            
            const messagesWithFiles = await Message.find({ fileData: { $exists: true, $ne: null } }).sort({ createdAt: 1 });
            let totalSize = messagesWithFiles.reduce((acc, m) => acc + (m.fileData ? m.fileData.length : 0), 0);
            
            // Add current message size
            totalSize += msg.fileData.length;

            if (totalSize > LIMIT_BYTES) {
                console.log(`[Storage] Limit reached (${(totalSize / 1024 / 1024).toFixed(2)}MB). Cleaning up oldest files...`);
                let deletedCount = 0;
                for (const oldMsg of messagesWithFiles) {
                    totalSize -= oldMsg.fileData.length;
                    await Message.findByIdAndDelete(oldMsg._id);
                    deletedCount++;
                    if (totalSize <= LIMIT_BYTES) break;
                }
                console.log(`[Storage] Deleted ${deletedCount} oldest messages with files.`);
            }
        } catch (err) {
            console.error('[Storage] Cleanup error:', err);
        }
    }
    return await Message.create(msg);
};
