const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Planning', 'In Progress', 'Completed', 'On Hold'], default: 'Planning' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{
        text: String,
        completed: { type: Boolean, default: false }
    }],
    tags: [{ type: String }],
    images: [{ type: String }],
    githubLink: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
