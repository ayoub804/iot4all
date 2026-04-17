/**
 * Seed initial badges:
 *   cd backend
 *   node scripts/seedBadges.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Badge = require('../models/Badge');

const BADGES = [
    {
        name: "Founder Supervisor",
        description: "Original Supervisor of IoT4ALL (First Generation)",
        icon: "👑",
        color: "#C8F135",
        generation: "Founder"
    },
    {
        name: "Founder Member",
        description: "Original Member of IoT4ALL (First Generation)",
        icon: "🌟",
        color: "#C8F135",
        generation: "Founder"
    },
    {
        name: "Supervisor",
        description: "Supervisor of IoT4ALL",
        icon: "🎯",
        color: "#6366F1",
        generation: "Regular"
    },
    {
        name: "Member",
        description: "Active Member of IoT4ALL",
        icon: "💪",
        color: "#10B981",
        generation: "Regular"
    }
];

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/iot4all');
        console.log('✓ MongoDB connected');

        // Clear all existing badges first
        await Badge.deleteMany({});
        console.log('✓ Cleared existing badges');

        for (const badgeData of BADGES) {
            await Badge.create(badgeData);
            console.log(`✓ Created badge: ${badgeData.name}`);
        }

        console.log('\n✓ All badges seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('✗ Error:', err.message);
        process.exit(1);
    }
})();
