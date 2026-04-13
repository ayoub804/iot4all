const express = require('express');
const router = express.Router();
const { getProjects, getProject, createProject, updateProject, deleteProject, toggleTask } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getProjects);
router.get('/:id', protect, getProject);
router.post('/', protect, authorize('Admin', 'Supervisor', 'Founder Supervisor', 'Founder Member'), createProject);
router.put('/:id', protect, authorize('Admin', 'Supervisor', 'Founder Supervisor', 'Founder Member'), updateProject);
router.delete('/:id', protect, authorize('Admin'), deleteProject);
router.patch('/:id/tasks/:taskId', protect, toggleTask);

module.exports = router;
