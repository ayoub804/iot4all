const Project = require('../models/Project');

// GET /api/projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('team', 'name avatar role').populate('createdBy', 'name');
        res.json({ projects });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/projects/:id
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('team', 'name avatar role');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json({ project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/projects  (Admin/Supervisor)
exports.createProject = async (req, res) => {
    try {
        const project = await Project.create({ ...req.body, createdBy: req.user.id });
        res.status(201).json({ project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/projects/:id
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json({ project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/projects/:id/tasks/:taskId  (toggle task completion)
exports.toggleTask = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        const task = project.tasks.id(req.params.taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        task.completed = !task.completed;
        await project.save();
        res.json({ project });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
