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
    status?: 'planning' | 'in-progress' | 'completed' | 'on-hold';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ projects: Project[]; pagination: any }>> => {
    const response = await apiClient.get('/projects', { params });
    return response.data;
  },

  getProject: async (id: string): Promise<ApiResponse<{ project: Project; tasks: any[] }>> => {
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


};