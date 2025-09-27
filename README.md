# Project Management Backend API

A comprehensive Node.js backend API for project management with user authentication, project creation, and task tracking functionality.

## 🚀 Features

- **User Authentication** - JWT-based authentication with bcrypt password hashing
- **Project Management** - Create, read, update, delete projects
- **Task Management** - Full CRUD operations on tasks with status tracking
- **Data Relationships** - Tasks linked to projects, projects owned by users
- **Security** - Rate limiting, CORS, input validation, and security headers
- **Seeding** - Automated database seeding with test data
- **Validation** - Comprehensive input validation using express-validator
- **Error handling** - Centralized error handling with proper HTTP status codes

## 📋 Requirements

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone and navigate to the project:**
   ```bash
   cd assignment_project_task
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   # The .env file is already created with default values
   # Update MONGO_URI if your MongoDB connection is different
   # Update JWT_SECRET in production
   ```

4. **Start MongoDB:**

   **Option 1: Using Docker (Recommended)**
   ```bash
   # Start MongoDB using Docker
   docker run -d --name pm_mongodb -p 27017:27017 mongo:7.0
   
   # Or use docker-compose (includes both MongoDB and app)
   docker-compose up -d
   ```

   **Option 2: Local MongoDB Installation**
   ```bash
   # Install MongoDB Community Edition
   # Follow: https://docs.mongodb.com/manual/installation/
   # Make sure MongoDB is running on localhost:27017
   ```

   **Option 3: MongoDB Atlas (Cloud)**
   ```bash
   # Update MONGO_URI in .env file with your Atlas connection string
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/project_management
   ```

5. **Seed the database:**
   ```bash
   npm run seed
   ```

6. **Start the server:**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 🗃️ Database Schema

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  isActive: Boolean (default: true),
  timestamps: true
}
```

### Project Model
```javascript
{
  title: String (required, 3-100 chars),
  description: String (required, 10-500 chars),
  status: String (enum: ['active', 'completed'], default: 'active'),
  owner: ObjectId (ref: User, required),
  tasksCount: Number (default: 0),
  completedTasksCount: Number (default: 0),
  timestamps: true
}
```

### Task Model
```javascript
{
  title: String (required, 3-100 chars),
  description: String (required, 10-500 chars),
  status: String (enum: ['todo', 'in-progress', 'done'], default: 'todo'),
  dueDate: Date (required, must be future date),
  project: ObjectId (ref: Project, required),
  assignedTo: ObjectId (ref: User, required),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  timestamps: true
}
```

## 🔑 API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test@123"
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

#### Logout User
```bash
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

### Project Routes (`/api/projects`)

#### Get All Projects
```bash
GET /api/projects
Authorization: Bearer <jwt_token>

# Query parameters:
# ?status=active|completed
# ?page=1&limit=10
```

#### Get Single Project
```bash
GET /api/projects/:id
Authorization: Bearer <jwt_token>
```

#### Create Project
```bash
POST /api/projects
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "New Project",
  "description": "Project description here",
  "status": "active"
}
```

#### Update Project
```bash
PUT /api/projects/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Project Title",
  "description": "Updated description",
  "status": "completed"
}
```

#### Delete Project
```bash
DELETE /api/projects/:id
Authorization: Bearer <jwt_token>
```

#### Get Project Tasks
```bash
GET /api/projects/:id/tasks
Authorization: Bearer <jwt_token>

# Query parameters:
# ?status=todo|in-progress|done
# ?page=1&limit=10
```

### Task Routes (`/api/tasks`)

#### Get All Tasks
```bash
GET /api/tasks
Authorization: Bearer <jwt_token>

# Query parameters:
# ?status=todo|in-progress|done
# ?project=<project_id>
# ?page=1&limit=10
```

#### Get Single Task
```bash
GET /api/tasks/:id
Authorization: Bearer <jwt_token>
```

#### Create Task
```bash
POST /api/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description here",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "project": "<project_id>",
  "status": "todo",
  "priority": "medium"
}
```

#### Update Task
```bash
PUT /api/tasks/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Task",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "high"
}
```

#### Delete Task
```bash
DELETE /api/tasks/:id
Authorization: Bearer <jwt_token>
```

#### Get Task Statistics
```bash
GET /api/tasks/stats/summary
Authorization: Bearer <jwt_token>
```

## 🧪 Testing with cURL

After seeding the database, you can test the APIs using the following cURL commands:

### 1. Login to get JWT token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

Save the returned token for subsequent requests.

### 2. Get all projects
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 3. Get all tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 4. Create a new project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Project",
    "description": "This is a test project created via cURL"
  }'
```

### 5. Create a new task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Task",
    "description": "This is a test task created via cURL",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "project": "PROJECT_ID_HERE"
  }'
```

### 6. Filter tasks by status
```bash
curl -X GET "http://localhost:5000/api/tasks?status=todo" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 7. Get task statistics
```bash
curl -X GET http://localhost:5000/api/tasks/stats/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 📦 Seeded Test Data

The seed script creates:

- **1 Test User:**
  - Email: `test@example.com`
  - Password: `Test@123`

- **3 Projects:**
  - E-commerce Website Development (5 tasks)
  - Mobile App Development (4 tasks) 
  - API Documentation Portal (4 tasks - completed project)

- **13 Total Tasks** with various statuses and priorities

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevents brute force attacks
- **Input Validation** - Comprehensive validation using express-validator
- **CORS** - Cross-origin resource sharing configuration
- **Security Headers** - Using helmet.js
- **Environment Variables** - Sensitive data protection

## 📁 Project Structure

```
src/
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── models/
│   ├── User.js          # User model with password hashing
│   ├── Project.js       # Project model with task counts
│   └── Task.js          # Task model with validations
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── projects.js      # Project CRUD routes
│   └── tasks.js         # Task CRUD routes
├── seeders/
│   └── index.js         # Database seeding script
└── server.js            # Main server file
```

## 🚀 Available Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm run seed     # Seed database with test data
npm test         # Run tests (jest - to be implemented)
```

## 🌐 Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/project_management
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📝 API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors array if applicable
  ]
}
```

## 🔍 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (access denied)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## 🎯 Next Steps

This backend is ready for frontend integration. The recommended frontend stack would be:
- React.js with TypeScript
- Tailwind CSS or Material-UI for styling
- Axios for API calls
- React Router for navigation
- Context API or Redux for state management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.