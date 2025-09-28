import React, { useState } from 'react';
import { Task } from '../types';
import { Button } from './common';
import { taskService } from '../services';
import { getStatusColor, getPriorityColor, formatDate, isOverdue } from '../utils/helpers';

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: 'pending' | 'in-progress' | 'completed') => {
    setIsUpdating(true);
    try {
      const response = await taskService.updateTask(task._id, { status: newStatus });
      if (response.success) {
        onUpdate(response.data.task);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(task._id);
        onDelete(task._id);
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const isDue = task.dueDate ? isOverdue(task.dueDate) : false;
  const projectTitle = typeof task.project === 'object' ? task.project.name : 'Unknown Project';

  return (
    <div className="card p-4 hover:shadow-medium transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-900 mb-1">
            {task.title}
          </h4>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {task.description}
          </p>
          <p className="text-xs text-gray-500">
            Project: {projectTitle}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
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
        {/* Status and Priority */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`status-badge ${getStatusColor(task.status)}`}>
              {task.status.replace('-', ' ')}
            </span>
            <span className={`status-badge ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          
          {task.dueDate && (
            <div className={`text-sm ${isDue ? 'text-red-600' : 'text-gray-600'}`}>
              Due: {formatDate(task.dueDate)}
              {isDue && <span className="ml-1 text-red-500">(Overdue)</span>}
            </div>
          )}
        </div>

        {/* Status Action Buttons */}
        <div className="flex space-x-2">
          {task.status !== 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('pending')}
              disabled={isUpdating}
              className="text-xs"
            >
              Pending
            </Button>
          )}
          {task.status !== 'in-progress' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('in-progress')}
              disabled={isUpdating}
              className="text-xs"
            >
              In Progress
            </Button>
          )}
          {task.status !== 'completed' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleStatusChange('completed')}
              disabled={isUpdating}
              className="text-xs"
            >
              Completed
            </Button>
          )}
        </div>

        {/* Created Date */}
        <div className="text-xs text-gray-500">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;