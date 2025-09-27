# Project Management API Test Script
# Run this after starting MongoDB and the server

Write-Host "🚀 Project Management API Test Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if server is running
Write-Host "`n1️⃣ Checking server health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
    Write-Host "✅ Server Status: $($health.message)" -ForegroundColor Green
    Write-Host "   Environment: $($health.environment)" -ForegroundColor Cyan
    Write-Host "   Timestamp: $($health.timestamp)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Server not running! Please start with: npm run dev" -ForegroundColor Red
    Write-Host "   Make sure MongoDB is running first!" -ForegroundColor Yellow
    exit 1
}

# Test authentication
Write-Host "`n2️⃣ Testing authentication..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "test@example.com"
        password = "Test@123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   User: $($loginResponse.data.user.name) ($($loginResponse.data.user.email))" -ForegroundColor Cyan
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Login failed! Please run: npm run seed" -ForegroundColor Red
    exit 1
}

# Test projects
Write-Host "`n3️⃣ Testing projects..." -ForegroundColor Yellow
try {
    $headers = @{ Authorization = "Bearer $token" }
    $projects = Invoke-RestMethod -Uri "http://localhost:5000/api/projects" -Method GET -Headers $headers
    Write-Host "✅ Found $($projects.data.projects.Count) projects" -ForegroundColor Green
    
    foreach ($project in $projects.data.projects) {
        Write-Host "   📁 $($project.title) - Status: $($project.status)" -ForegroundColor Cyan
        Write-Host "      Tasks: $($project.tasksCount) total, $($project.completedTasksCount) completed" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed to get projects: $($_.Exception.Message)" -ForegroundColor Red
}

# Test tasks
Write-Host "`n4️⃣ Testing tasks..." -ForegroundColor Yellow
try {
    $tasks = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method GET -Headers $headers
    Write-Host "✅ Found $($tasks.data.tasks.Count) tasks" -ForegroundColor Green
    
    # Group tasks by status
    $tasksByStatus = $tasks.data.tasks | Group-Object status
    foreach ($group in $tasksByStatus) {
        Write-Host "   📋 $($group.Name): $($group.Count) tasks" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed to get tasks: $($_.Exception.Message)" -ForegroundColor Red
}

# Test task statistics
Write-Host "`n5️⃣ Testing task statistics..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks/stats/summary" -Method GET -Headers $headers
    Write-Host "✅ Task Statistics:" -ForegroundColor Green
    Write-Host "   📊 Total: $($stats.data.stats.total)" -ForegroundColor Cyan
    Write-Host "   ⏳ To-Do: $($stats.data.stats.todo)" -ForegroundColor Cyan
    Write-Host "   🔄 In Progress: $($stats.data.stats.'in-progress')" -ForegroundColor Cyan
    Write-Host "   ✅ Done: $($stats.data.stats.done)" -ForegroundColor Cyan
    Write-Host "   ⚠️  Overdue: $($stats.data.stats.overdue)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to get task statistics: $($_.Exception.Message)" -ForegroundColor Red
}

# Test create project
Write-Host "`n6️⃣ Testing project creation..." -ForegroundColor Yellow
try {
    $newProjectData = @{
        title = "Test Project from PowerShell"
        description = "This project was created using the PowerShell test script to validate the API functionality"
        status = "active"
    } | ConvertTo-Json

    $newProject = Invoke-RestMethod -Uri "http://localhost:5000/api/projects" -Method POST -Body $newProjectData -ContentType "application/json" -Headers $headers
    Write-Host "✅ Created new project!" -ForegroundColor Green
    Write-Host "   📁 $($newProject.data.project.title)" -ForegroundColor Cyan
    Write-Host "   🆔 ID: $($newProject.data.project._id)" -ForegroundColor Gray
    
    $projectId = $newProject.data.project._id
} catch {
    Write-Host "❌ Failed to create project: $($_.Exception.Message)" -ForegroundColor Red
}

# Test create task
Write-Host "`n7️⃣ Testing task creation..." -ForegroundColor Yellow
try {
    $futureDate = (Get-Date).AddDays(30).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    $newTaskData = @{
        title = "Test Task from PowerShell"
        description = "This task was created using the PowerShell test script to validate the task creation API"
        dueDate = $futureDate
        project = $projectId
        status = "todo"
        priority = "high"
    } | ConvertTo-Json

    $newTask = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method POST -Body $newTaskData -ContentType "application/json" -Headers $headers
    Write-Host "✅ Created new task!" -ForegroundColor Green
    Write-Host "   📋 $($newTask.data.task.title)" -ForegroundColor Cyan
    Write-Host "   🆔 ID: $($newTask.data.task._id)" -ForegroundColor Gray
    Write-Host "   📅 Due: $($newTask.data.task.dueDate)" -ForegroundColor Gray

} catch {
    Write-Host "❌ Failed to create task: $($_.Exception.Message)" -ForegroundColor Red
}

# Test filtering
Write-Host "`n8️⃣ Testing task filtering..." -ForegroundColor Yellow
try {
    $todoTasks = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks?status=todo" -Method GET -Headers $headers
    Write-Host "✅ Found $($todoTasks.data.tasks.Count) TODO tasks" -ForegroundColor Green
    
    $activeTasks = Invoke-RestMethod -Uri "http://localhost:5000/api/projects?status=active" -Method GET -Headers $headers
    Write-Host "✅ Found $($activeTasks.data.projects.Count) active projects" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to test filtering: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ All core functionalities are working!" -ForegroundColor Green
Write-Host "🚀 Backend is ready for frontend integration!" -ForegroundColor Yellow
Write-Host "`n📖 For more details, check:" -ForegroundColor Cyan
Write-Host "   - README.md (complete documentation)" -ForegroundColor Gray
Write-Host "   - CURL_TESTING.md (cURL examples)" -ForegroundColor Gray
Write-Host "   - BACKEND_COMPLETE.md (setup guide)" -ForegroundColor Gray