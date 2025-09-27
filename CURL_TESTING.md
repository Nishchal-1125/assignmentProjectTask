# Complete cURL Testing Guide for Project Management API

This file contains comprehensive cURL commands to test all API endpoints. Execute these commands in order for the best testing experience.

## Prerequisites
1. Start the server: `npm run dev`
2. Seed the database: `npm run seed`
3. Server should be running on http://localhost:5000

## 1. Authentication Tests

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

### Login with Seeded Test User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

**⚠️ IMPORTANT: Copy the token from the login response and replace `YOUR_JWT_TOKEN_HERE` in all subsequent commands**

### Get Current User Profile
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Logout User
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 2. Project Management Tests

### Get All Projects
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Get Projects with Filtering (Active Only)
```bash
curl -X GET "http://localhost:5000/api/projects?status=active&page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Get Single Project (use project ID from previous response)
```bash
curl -X GET http://localhost:5000/api/projects/PROJECT_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Create New Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project via cURL",
    "description": "This project was created using cURL command for testing the API endpoints",
    "status": "active"
  }'
```

### Update Project (use project ID from create response)
```bash
curl -X PUT http://localhost:5000/api/projects/PROJECT_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Test Project",
    "description": "This project has been updated via cURL",
    "status": "completed"
  }'
```

### Get Project Tasks (use project ID)
```bash
curl -X GET http://localhost:5000/api/projects/PROJECT_ID_HERE/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 3. Task Management Tests

### Get All Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Get Tasks with Filtering
```bash
# Get only TODO tasks
curl -X GET "http://localhost:5000/api/tasks?status=todo" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Get tasks for specific project
curl -X GET "http://localhost:5000/api/tasks?project=PROJECT_ID_HERE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Get tasks with pagination
curl -X GET "http://localhost:5000/api/tasks?page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Get Single Task (use task ID from previous response)
```bash
curl -X GET http://localhost:5000/api/tasks/TASK_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Create New Task (use valid project ID)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task via cURL",
    "description": "This task was created using cURL command for API endpoint testing",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "project": "PROJECT_ID_HERE",
    "status": "todo",
    "priority": "high"
  }'
```

### Update Task (use task ID)
```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Test Task",
    "description": "This task has been updated via cURL",
    "status": "in-progress",
    "priority": "medium"
  }'
```

### Get Task Statistics
```bash
curl -X GET http://localhost:5000/api/tasks/stats/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Delete Task (use task ID)
```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Delete Project (use project ID)
```bash
curl -X DELETE http://localhost:5000/api/projects/PROJECT_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 4. Error Testing

### Test Invalid Authentication
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer invalid_token"
```

### Test Missing Authentication
```bash
curl -X GET http://localhost:5000/api/projects
```

### Test Invalid Data
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "description": "Short"
  }'
```

### Test Rate Limiting (run this command multiple times quickly)
```bash
for i in {1..50}; do
  curl -X GET http://localhost:5000/api/health
done
```

## 5. Health Check
```bash
curl -X GET http://localhost:5000/api/health
```

## Expected Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors if applicable
  ]
}
```

## Quick Test Script

Here's a PowerShell script to run basic tests:

```powershell
# Save this as test-api.ps1 and run: .\test-api.ps1

# 1. Health check
Write-Host "Testing health endpoint..."
$health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
Write-Host "Health Status: $($health.message)"

# 2. Login
Write-Host "Logging in..."
$loginData = @{
    email = "test@example.com"
    password = "Test@123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $loginResponse.data.token
Write-Host "Login successful, token obtained"

# 3. Get projects
Write-Host "Getting projects..."
$headers = @{ Authorization = "Bearer $token" }
$projects = Invoke-RestMethod -Uri "http://localhost:5000/api/projects" -Method GET -Headers $headers
Write-Host "Found $($projects.data.projects.Count) projects"

# 4. Get tasks
Write-Host "Getting tasks..."
$tasks = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method GET -Headers $headers
Write-Host "Found $($tasks.data.tasks.Count) tasks"

Write-Host "API test completed successfully!"
```

## Notes

1. Replace `YOUR_JWT_TOKEN_HERE` with the actual JWT token from login response
2. Replace `PROJECT_ID_HERE` with actual project IDs from API responses
3. Replace `TASK_ID_HERE` with actual task IDs from API responses
4. Due dates must be in the future (ISO 8601 format)
5. All authenticated endpoints require the `Authorization: Bearer <token>` header
6. The server runs on port 5000 by default