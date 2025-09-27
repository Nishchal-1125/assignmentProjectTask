import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { Button } from './common';
import { projectService } from '../services';
import { getStatusColor } from '../utils/helpers';

interface ProjectCardProps {
  project: Project;
  onDelete: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      try {
        await projectService.deleteProject(project._id);
        onDelete(project._id);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const completionPercentage = project.tasksCount > 0 
    ? Math.round((project.completedTasksCount / project.tasksCount) * 100)
    : 0;

  return (
    <div className="card p-6 hover:shadow-medium transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <Link 
          to={`/projects/${project._id}`}
          className="flex-1 hover:text-primary-600 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {project.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {project.description}
          </p>
        </Link>
        
        <div className="flex items-center space-x-2 ml-4">
          <span className={`status-badge ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            className="!px-2 !py-1"
          >
            ×
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Task Stats */}
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tasks: {project.tasksCount}</span>
          <span>Completed: {project.completedTasksCount}</span>
        </div>

        {/* Created Date */}
        <div className="text-xs text-gray-500">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;