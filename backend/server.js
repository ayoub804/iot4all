const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { createMessage } = require('./controllers/messageController');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/members'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/recruitment', require('./routes/recruitment'));
app.use('/api/messages', require('./routes/messages'));

app.get('/', (req, res) => res.json({ message: 'IoT4ALL API Running ✓' }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Server Error' });
});

// ---------- Socket.io real-time chat ----------
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication error'));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = await User.findById(decoded.id).select('name avatar role');
        next();
    } catch {
        next(new Error('Authentication error'));
    }
});

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.user?.name || socket.id}`);

    socket.on('join_channel', (channelName) => {
        socket.join(channelName);
    });

    socket.on('send_message', async (data) => {
        try {
            const saved = await createMessage({
                channel: data.channel,
                user: socket.user._id,
                content: data.content
            });

            const payload = {
                _id: saved._id,
                channel: data.channel,
                content: data.content,
                user: { _id: socket.user._id, name: socket.user.name, avatar: socket.user.avatar, role: socket.user.role },
                createdAt: saved.createdAt
            };

            io.to(data.channel).emit('receive_message', payload);
        } catch (err) {
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.user?.name || socket.id}`);
    });
});

// ---------- Database + Server boot ----------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/iot4all';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✓ MongoDB connected');
        server.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.warn('⚠ MongoDB connection failed — starting without DB (UI-test mode)');
        console.warn(err.message);
        server.listen(PORT, () => console.log(`✓ Server running on port ${PORT} (no DB)`));
    });
