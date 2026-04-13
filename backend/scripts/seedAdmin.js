/**
 * Run this script once to seed an Admin user:
 *   cd backend
 *   node scripts/seedAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN = {
    name: 'Ayoub Mraihi',
    email: 'mraihiayoub123@gmail.com',
    password: 'Admin@1234',
    role: 'Admin',
    field: 'Computer Science',
    skills: ['Full Stack', 'IoT', 'AI'],
    status: 'Active'
};

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/iot4all');
        console.log('✓ MongoDB connected');

        const existing = await User.findOne({ email: ADMIN.email });
        if (existing) {
            // Upgrade to Admin if exists
            existing.role = 'Admin';
            existing.status = 'Active';
            await existing.save();
            console.log(`✓ Existing user upgraded to Admin: ${ADMIN.email}`);
        } else {
            await User.create(ADMIN);
            console.log(`✓ Admin user created: ${ADMIN.email}`);
        }

        console.log('\nLogin credentials:');
        console.log(`  Email:    ${ADMIN.email}`);
        console.log(`  Password: ${ADMIN.password}`);
        process.exit(0);
    } catch (err) {
        console.error('✗ Error:', err.message);
        process.exit(1);
    }
})();
