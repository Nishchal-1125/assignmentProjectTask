import apiClient from './api';
import {
  Task,
  ApiResponse,
  TaskStats,
  CreateTaskData,
  UpdateTaskData,
} from '../types';

export const taskService = {
  getTasks: async (params?: {
    status?: 'todo' | 'in-progress' | 'done';
    project?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ tasks: Task[]; pagination: any }>> => {
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },

  getTask: async (id: string): Promise<ApiResponse<{ task: Task }>> => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: CreateTaskData): Promise<ApiResponse<{ task: Task }>> => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: string, taskData: UpdateTaskData): Promise<ApiResponse<{ task: Task }>> => {
    const response = await apiClient.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },

  getTaskStats: async (): Promise<ApiResponse<{ stats: TaskStats }>> => {
    const response = await apiClient.get('/tasks/stats/summary');
    return response.data;
  },
};