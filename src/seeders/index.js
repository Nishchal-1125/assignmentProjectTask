const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project_management');
    // console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    const demoUser = new User({
      name: 'Demo User',
      email: 'test@example.com',
      password: 'Test@123'
    });
    await demoUser.save();
    console.log('Demo user created');

    const project1 = new Project({
      name: 'Website Redesign',
      description: 'Complete redesign of company website with modern UI/UX',
      status: 'in-progress',
      priority: 'high',
      owner: demoUser._id,
      tags: ['web', 'design', 'frontend']
    });

    const project2 = new Project({
      name: 'Mobile App Development',
      description: 'Develop cross-platform mobile application',
      status: 'planning',
      priority: 'medium',
      owner: demoUser._id,
      tags: ['mobile', 'react-native', 'app']
    });

    await project1.save();
    await project2.save();
    console.log('Sample projects created');

    const tasks = [
      {
        title: 'Design homepage mockup',
        description: 'Create wireframes and mockups for the new homepage design',
        status: 'completed',
        priority: 'high',
        project: project1._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id
      },
      {
        title: 'Implement responsive navigation',
        description: 'Code the responsive navigation menu for all screen sizes',
        status: 'in-progress',
        priority: 'medium',
        project: project1._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id
      },
      {
        title: 'Set up development environment',
        description: 'Configure development tools and environment for mobile app',
        status: 'pending',
        priority: 'high',
        project: project2._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id
      }
    ];

    await Task.insertMany(tasks);
    console.log('Sample tasks created');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nDemo credentials:');
    console.log('Email: test@example.com');
    console.log('Password: Test@123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();