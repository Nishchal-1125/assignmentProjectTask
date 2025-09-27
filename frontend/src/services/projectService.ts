import apiClient from './api';
import {
  Project,
  ApiResponse,
  PaginationData,
  CreateProjectData,
  UpdateProjectData,
} from '../types';

export const projectService = {
  getProjects: async (params?: {
    status?: 'active' | 'completed';
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ projects: Project[]; pagination: any }>> => {
    const response = await apiClient.get('/projects', { params });
    return response.data;
  },

  getProject: async (id: string): Promise<ApiResponse<{ project: Project }>> => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData: CreateProjectData): Promise<ApiResponse<{ project: Project }>> => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id: string, projectData: UpdateProjectData): Promise<ApiResponse<{ project: Project }>> => {
    const response = await apiClient.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },

  getProjectTasks: async (
    id: string,
    params?: {
      status?: 'todo' | 'in-progress' | 'done';
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<{ project: Project; tasks: any[]; pagination: any }>> => {
    const response = await apiClient.get(`/projects/${id}/tasks`, { params });
    return response.data;
  },
};