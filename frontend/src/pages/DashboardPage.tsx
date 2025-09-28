import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectService, taskService } from '../services';
import { Project, Task, TaskStats } from '../types';
import { Button, Loader, Pagination } from '../components/common';
import TaskCard from '../components/TaskCard';
import CreateProjectModal from '../components/CreateProjectModal';
import CreateTaskModal from '../components/CreateTaskModal';
import StatsCards from '../components/StatsCards';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
  
  // UI state
  const [showRecentActivity, setShowRecentActivity] = useState(false);

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

        {/* Projects Section - Simple List */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
              <Button onClick={() => setShowCreateProject(true)}>
                Add Project
              </Button>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No projects yet</p>
                <Button onClick={() => setShowCreateProject(true)}>
                  Create Your First Project
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      onClick={() => navigate(`/projects/${project._id}`)}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-500">Progress</span>
                              <span className="text-xs text-gray-500">{project.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${project.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                            <span>Tasks: {project.tasksCount || 0}</span>
                            <span>Completed: {project.completedTasksCount || 0}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Projects Pagination - More Visible */}
                {projectsPagination.pages > 1 && (
                  <div className="border-t pt-4 bg-gray-50 -mx-6 px-6 py-4">
                    <Pagination
                      currentPage={projectsPagination.current}
                      totalPages={projectsPagination.pages}
                      onPageChange={handleProjectsPageChange}
                      showInfo={true}
                      totalItems={projectsPagination.total}
                      itemsPerPage={6}
                    />
                  </div>
                )}
              </>
            )}
          </div>

        {/* Recent Activity Section - Expandable */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            {/* Header - Always Visible */}
            <div 
              className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50"
              onClick={() => setShowRecentActivity(!showRecentActivity)}
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-500 mt-1">Latest projects and tasks</p>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showRecentActivity ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {/* Expandable Content */}
            {showRecentActivity && (
              <div className="border-t p-6">
                {tasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No recent activity yet</p>
                    <p className="text-sm text-gray-400">New projects and tasks will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.slice(0, 6).map((task) => (
                      <div key={task._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="text-sm text-gray-500">
                            Created {new Date(task.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                          <span className="text-xs text-gray-400">
                            Task
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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