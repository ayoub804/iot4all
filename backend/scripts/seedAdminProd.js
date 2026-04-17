/**
 * Seed admin user to PRODUCTION MongoDB
 * 
 * Usage:
 *   cd backend
 *   node scripts/seedAdminProd.js
 * 
 * Make sure to set MONGO_URI in .env to your PRODUCTION MongoDB URL!
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const ADMIN_DATA = {
    name: "Admin",
    email: "mraihiayoub123@gmail.com",
    password: "Admin@1234",
    role: "Admin",
    status: "Active"
};

(async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        if (!MONGO_URI || MONGO_URI.includes('localhost')) {
            console.error('✗ ERROR: Set MONGO_URI in .env to your PRODUCTION MongoDB URL!');
            process.exit(1);
        }

        console.log('✓ Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✓ MongoDB connected');

        const existing = await User.findOne({ email: ADMIN_DATA.email });
        if (existing) {
            if (existing.role !== 'Admin') {
                existing.role = 'Admin';
                await existing.save();
                console.log('✓ User upgraded to Admin:', ADMIN_DATA.email);
            } else {
                console.log('✓ Admin already exists:', ADMIN_DATA.email);
            }
        } else {
            const hashedPassword = await bcrypt.hash(ADMIN_DATA.password, 12);
            await User.create({ ...ADMIN_DATA, password: hashedPassword });
            console.log('✓ Admin created:', ADMIN_DATA.email);
        }

        console.log('\n✓ Success! Login credentials:');
        console.log('  Email:   ', ADMIN_DATA.email);
        console.log('  Password:', ADMIN_DATA.password);

        process.exit(0);
    } catch (err) {
        console.error('✗ Error:', err.message);
        process.exit(1);
    }
})();
