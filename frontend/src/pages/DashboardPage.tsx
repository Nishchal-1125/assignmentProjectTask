import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectService, taskService } from '../services';
import { Project, Task, TaskStats } from '../types';
import { Button, Loader, Pagination } from '../components/common';
import ProjectCard from '../components/ProjectCard';
import TaskCard from '../components/TaskCard';
import CreateProjectModal from '../components/CreateProjectModal';
import CreateTaskModal from '../components/CreateTaskModal';
import StatsCards from '../components/StatsCards';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  
  // Pagination state
  const [projectsPagination, setProjectsPagination] = useState({ current: 1, total: 0, pages: 1 });
  const [tasksPagination, setTasksPagination] = useState({ current: 1, total: 0, pages: 1 });
  const [projectsPage, setProjectsPage] = useState(1);
  const [tasksPage, setTasksPage] = useState(1);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadDashboardData(projectsPage, 1);
  }, [projectsPage]);

  useEffect(() => {
    setTasksPage(1); // Reset to first page when filter changes
    loadDashboardData(projectsPage, 1);
  }, [filterStatus]);

  const loadDashboardData = async (projPage = projectsPage, taskPage = tasksPage) => {
    setIsLoading(true);
    try {
      const [projectsRes, tasksRes, allTasksRes] = await Promise.all([
        projectService.getProjects({ page: projPage, limit: 6 }),
        taskService.getTasks({ page: taskPage, limit: 8, status: filterStatus === 'all' ? undefined : filterStatus }),
        taskService.getTasks({ limit: 1000 }), // Get all tasks for stats
      ]);

      if (projectsRes.success) {
        setProjects(projectsRes.data.projects);
        if (projectsRes.data.pagination) {
          setProjectsPagination(projectsRes.data.pagination);
        }
      }

      if (tasksRes.success) {
        setTasks(tasksRes.data.tasks);
        if (tasksRes.data.pagination) {
          setTasksPagination(tasksRes.data.pagination);
        }
      }

      // Calculate stats from all tasks
      if (allTasksRes.success) {
        const allTasks = allTasksRes.data.tasks;
        const calculatedStats: TaskStats = {
          total: allTasks.length,
          pending: allTasks.filter(t => t.status === 'pending').length,
          'in-progress': allTasks.filter(t => t.status === 'in-progress').length,
          completed: allTasks.filter(t => t.status === 'completed').length,
        };
        setStats(calculatedStats);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    setShowCreateProject(false);
    loadDashboardData(); // Refresh to get updated stats
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
    setShowCreateTask(false);
    loadDashboardData(); // Refresh to get updated stats
  };

  const handleProjectDeleted = (projectId: string) => {
    setProjects(projects.filter(p => p._id !== projectId));
    setTasks(tasks.filter(t => typeof t.project === 'object' ? t.project._id !== projectId : t.project !== projectId));
    loadDashboardData(); // Refresh to get updated stats
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
    loadDashboardData(); // Refresh to get updated stats
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter(t => t._id !== taskId));
    loadDashboardData(); // Refresh to get updated stats
  };

  // Pagination handlers
  const handleProjectsPageChange = (page: number) => {
    setProjectsPage(page);
  };

  const handleTasksPageChange = (page: number) => {
    setTasksPage(page);
    loadDashboardData(projectsPage, page);
  };

  const filteredTasks = tasks; // Tasks are already filtered on the backend

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="primary"
                onClick={() => setShowCreateProject(true)}
              >
                New Project
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateTask(true)}
              >
                New Task
              </Button>
              <Button
                variant="secondary"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && <StatsCards stats={stats} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Projects Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateProject(true)}
              >
                Add Project
              </Button>
            </div>

            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="card p-8 text-center">
                  <p className="text-gray-500 mb-4">No projects yet</p>
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateProject(true)}
                  >
                    Create Your First Project
                  </Button>
                </div>
              ) : (
                projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onDelete={handleProjectDeleted}
                  />
                ))
              )}
            </div>
            
            {/* Projects Pagination */}
            <Pagination
              currentPage={projectsPagination.current}
              totalPages={projectsPagination.pages}
              onPageChange={handleProjectsPageChange}
              showInfo={true}
              totalItems={projectsPagination.total}
              itemsPerPage={6}
            />
          </div>

          {/* Tasks Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="form-input text-sm"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateTask(true)}
                >
                  Add Task
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="card p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    {filterStatus === 'all' ? 'No tasks yet' : `No ${filterStatus} tasks`}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateTask(true)}
                  >
                    Create Your First Task
                  </Button>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onUpdate={handleTaskUpdated}
                    onDelete={handleTaskDeleted}
                  />
                ))
              )}
            </div>
            
            {/* Tasks Pagination */}
            <Pagination
              currentPage={tasksPagination.current}
              totalPages={tasksPagination.pages}
              onPageChange={handleTasksPageChange}
              showInfo={true}
              totalItems={tasksPagination.total}
              itemsPerPage={8}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onSuccess={handleProjectCreated}
        />
      )}

      {showCreateTask && (
        <CreateTaskModal
          projects={projects}
          onClose={() => setShowCreateTask(false)}
          onSuccess={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default DashboardPage;