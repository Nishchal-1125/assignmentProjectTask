const express = require('express');
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Task = require('../models/Task');
const router = express.Router();

// Get recent activity (latest 6-8  and tasks)
router.get('/recent-activity', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = 8;

    const recentProjects = await Project.find({ owner: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name description status createdAt')
      .lean();

    const recentTasks = await Task.find({ assignedTo: userId })
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title status priority createdAt project')
      .lean();

    const combinedActivity = [
      ...recentProjects.map(project => ({
        _id: project._id,
        type: 'project',
        title: project.name,
        description: project.description,
        status: project.status,
        createdAt: project.createdAt
      })),
      ...recentTasks.map(task => ({
        _id: task._id,
        type: 'task',
        title: task.title,
        description: task.project?.name ? `Project: ${task.project.name}` : '',
        status: task.status,
        priority: task.priority,
        createdAt: task.createdAt
      }))
    ];

    const recentActivity = combinedActivity
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    res.json({
      success: true,
      data: recentActivity,
      total: recentActivity.length
    });

  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
      error: error.message
    });
  }
});

module.exports = router;