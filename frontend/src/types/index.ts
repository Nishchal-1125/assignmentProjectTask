export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: string;
  endDate?: string;
  owner: User | string;
  team?: User[];
  tags?: string[];
  tasksCount?: number;
  completedTasksCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignedTo?: User;
  project: Project | string;
  createdBy: User;
  tags?: string[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationData<T> {
  items: T[];
  pagination: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
}

export interface TaskStats {
  total: number;
  pending: number;
  'in-progress': number;
  completed: number;
  overdue?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  endDate?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  endDate?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: string;
  project: string;
  assignedTo?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  dueDate?: string;
  assignedTo?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}