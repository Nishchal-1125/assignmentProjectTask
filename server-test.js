const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : '*',
  credentials: true
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint without MongoDB
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working! Ready for MongoDB connection.',
    data: {
      server: 'Express.js',
      status: 'healthy',
      mongodb: 'Not connected - please start MongoDB first'
    }
  });
});

// Import routes only when MongoDB is available
let authRoutes, projectRoutes, taskRoutes;

try {
  authRoutes = require('./src/routes/auth');
  projectRoutes = require('./src/routes/projects');
  taskRoutes = require('./src/routes/tasks');
  
  // Database connection test
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Add routes after successful MongoDB connection
    app.use('/api/auth', authRoutes);
    app.use('/api/projects', projectRoutes);
    app.use('/api/tasks', taskRoutes);
    
    console.log('✅ All API routes loaded');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Please start MongoDB first using one of these methods:');
    console.log('   1. Docker: docker run -d --name pm_mongodb -p 27017:27017 mongo:7.0');
    console.log('   2. Local: Start your local MongoDB service');
    console.log('   3. Atlas: Update MONGO_URI in .env with your Atlas connection string');
    console.log('');
    console.log('🚀 Server still running on basic endpoints for testing');
  });

} catch (error) {
  console.error('Error loading routes:', error.message);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log('🚀 Server Details:');
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Test Endpoint: http://localhost:${PORT}/api/test`);
  console.log('');
});

module.exports = app;