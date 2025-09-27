import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Project, Task } from '../types';
import { projectService } from '../services';
import { Button, Loader } from '../components/common';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import { getStatusColor } from '../utils/helpers';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');

  useEffect(() => {
    if (id) {
      loadProjectDetails();
    }
  }, [id]);

  const loadProjectDetails = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectService.getProject(id),
        projectService.getProjectTasks(id, { limit: 100 }),
      ]);

      if (projectRes.success) {
        setProject(projectRes.data.project);
      } else {
        navigate('/dashboard');
        return;
      }

      if (tasksRes.success) {
        setTasks(tasksRes.data.tasks);
      }
    } catch (error) {
      console.error('Error loading project details:', error);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
    setShowCreateTask(false);
    loadProjectDetails(); // Refresh to get updated project stats
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
    loadProjectDetails(); // Refresh to get updated project stats
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter(t => t._id !== taskId));
    loadProjectDetails(); // Refresh to get updated project stats
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <Link to="/dashboard">
            <Button variant="primary">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const completionPercentage = project.tasksCount > 0 
    ? Math.round((project.completedTasksCount / project.tasksCount) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`status-badge ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    {completionPercentage}% Complete
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowCreateTask(true)}
            >
              Add Task
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Info */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="text-sm text-gray-500">
                <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                <p>Last Updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Progress</h2>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Task Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{project.tasksCount}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{project.completedTasksCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            <div className="flex items-center space-x-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="form-input text-sm"
              >
                <option value="all">All Tasks ({tasks.length})</option>
                <option value="todo">To Do ({tasks.filter(t => t.status === 'todo').length})</option>
                <option value="in-progress">In Progress ({tasks.filter(t => t.status === 'in-progress').length})</option>
                <option value="done">Done ({tasks.filter(t => t.status === 'done').length})</option>
              </select>
              <Button
                variant="outline"
                onClick={() => setShowCreateTask(true)}
              >
                Add Task
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTasks.length === 0 ? (
              <div className="col-span-2">
                <div className="card p-12 text-center">
                  <p className="text-gray-500 mb-4">
                    {filterStatus === 'all' ? 'No tasks in this project yet' : `No ${filterStatus} tasks`}
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateTask(true)}
                  >
                    Create First Task
                  </Button>
                </div>
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
        </div>
      </main>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTaskModal
          projects={[project]}
          onClose={() => setShowCreateTask(false)}
          onSuccess={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default ProjectDetailsPage;