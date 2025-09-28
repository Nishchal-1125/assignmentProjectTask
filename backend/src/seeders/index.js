const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project_management');
 

    console.log('Connected to MongoDB',process.env.MONGODB_URI );

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

    // Create multiple projects
    const projects = [
      {
        name: 'E-commerce Platform',
        description: 'Build a modern e-commerce platform with advanced features',
        status: 'in-progress',
        priority: 'urgent',
        owner: demoUser._id,
        tags: ['web', 'ecommerce', 'fullstack'],
        endDate: new Date('2025-12-31')
      },
      {
        name: 'Mobile App Development',
        description: 'Develop cross-platform mobile application for iOS and Android',
        status: 'planning',
        priority: 'high',
        owner: demoUser._id,
        tags: ['mobile', 'react-native', 'app'],
        endDate: new Date('2025-11-15')
      },
      {
        name: 'Data Analytics Dashboard',
        description: 'Create comprehensive analytics dashboard for business intelligence',
        status: 'in-progress',
        priority: 'medium',
        owner: demoUser._id,
        tags: ['analytics', 'dashboard', 'data'],
        endDate: new Date('2025-10-30')
      },
      {
        name: 'API Microservices',
        description: 'Develop scalable microservices architecture for backend systems',
        status: 'completed',
        priority: 'high',
        owner: demoUser._id,
        tags: ['api', 'microservices', 'backend'],
        endDate: new Date('2025-09-15')
      },
      {
        name: 'Marketing Website',
        description: 'Design and develop new marketing website with SEO optimization',
        status: 'on-hold',
        priority: 'low',
        owner: demoUser._id,
        tags: ['marketing', 'seo', 'website'],
        endDate: new Date('2026-02-28')
      }
    ];

    const savedProjects = await Project.insertMany(projects);
    // console.log('Sample projects created');

    const tasks = [];
    
    tasks.push(
      {
        title: 'Design product catalog UI',
        description: 'Create responsive product catalog with filtering and search capabilities',
        status: 'completed',
        priority: 'high',
        project: savedProjects[0]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-10-15')
      },
      {
        title: 'Implement shopping cart',
        description: 'Build shopping cart functionality with add/remove/update operations',
        status: 'in-progress',
        priority: 'urgent',
        project: savedProjects[0]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-10-25')
      },
      {
        title: 'Payment gateway integration',
        description: 'Integrate secure payment processing with multiple payment methods',
        status: 'pending',
        priority: 'urgent',
        project: savedProjects[0]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-11-05')
      },
      {
        title: 'User authentication system',
        description: 'Implement user registration, login, and profile management',
        status: 'completed',
        priority: 'high',
        project: savedProjects[0]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-10-10')
      }
    );

    // Mobile App Development tasks
    tasks.push(
      {
        title: 'Setup development environment',
        description: 'Configure React Native development environment and tools',
        status: 'completed',
        priority: 'high',
        project: savedProjects[1]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-10-01')
      },
      {
        title: 'Design app wireframes',
        description: 'Create detailed wireframes for all app screens and user flows',
        status: 'in-progress',
        priority: 'medium',
        project: savedProjects[1]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-10-20')
      },
      {
        title: 'Implement navigation',
        description: 'Set up app navigation structure using React Navigation',
        status: 'pending',
        priority: 'medium',
        project: savedProjects[1]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-11-01')
      }
    );

    // Data Analytics Dashboard tasks
    tasks.push(
      {
        title: 'Database schema design',
        description: 'Design optimal database schema for analytics data storage',
        status: 'completed',
        priority: 'high',
        project: savedProjects[2]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-09-25')
      },
      {
        title: 'Chart components development',
        description: 'Develop reusable chart components for data visualization',
        status: 'in-progress',
        priority: 'medium',
        project: savedProjects[2]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-10-15')
      },
      {
        title: 'Real-time data sync',
        description: 'Implement real-time data synchronization for live dashboard updates',
        status: 'pending',
        priority: 'high',
        project: savedProjects[2]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-10-30')
      },
      {
        title: 'User permissions system',
        description: 'Create role-based access control for dashboard features',
        status: 'pending',
        priority: 'medium',
        project: savedProjects[2]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-11-10')
      }
    );

    // API Microservices tasks (completed project)
    tasks.push(
      {
        title: 'Service architecture design',
        description: 'Design microservices architecture and service boundaries',
        status: 'completed',
        priority: 'urgent',
        project: savedProjects[3]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-08-15')
      },
      {
        title: 'User service implementation',
        description: 'Implement user management microservice with authentication',
        status: 'completed',
        priority: 'high',
        project: savedProjects[3]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-08-30')
      },
      {
        title: 'API gateway setup',
        description: 'Configure API gateway for service routing and load balancing',
        status: 'completed',
        priority: 'high',
        project: savedProjects[3]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-09-10')
      }
    );

    // Marketing Website tasks (on-hold project)
    tasks.push(
      {
        title: 'Market research analysis',
        description: 'Conduct comprehensive market research and competitor analysis',
        status: 'completed',
        priority: 'medium',
        project: savedProjects[4]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-12-01')
      },
      {
        title: 'Content strategy development',
        description: 'Develop content strategy and SEO-optimized content plan',
        status: 'pending',
        priority: 'low',
        project: savedProjects[4]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-12-15')
      },
      {
        title: 'Brand identity design',
        description: 'Create comprehensive brand identity and design system',
        status: 'pending',
        priority: 'low',
        project: savedProjects[4]._id,
        createdBy: demoUser._id,
        assignedTo: demoUser._id,
        dueDate: new Date('2025-12-30')
      }
    );

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