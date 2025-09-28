const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    minlength: [3, 'Project name must be at least 3 characters long'],
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project owner is required']
  },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }]
}, {
  timestamps: true
});

projectSchema.virtual('tasksCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true
});

projectSchema.virtual('completedTasksCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
  count: true,
  match: { status: 'completed' }
});

projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Project', projectSchema);