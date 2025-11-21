import api, { handleApiError } from './api';
import { User } from '@/types/user.types';

export interface CreateAdminRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  station: string;
}

export interface UpdateAdminRequest {
  name?: string;
  email?: string;
  phone?: string;
  station?: string;
}

class AdminService {
  /**
   * Get all station admins (superadmin only)
   */
  async getAdmins(params?: {
    station?: string;
    is_active?: boolean;
    search?: string;
    page?: number;
  }): Promise<User[]> {
    try {
      const response = await api.get<User[]>('/admins/', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get admin by ID
   */
  async getAdmin(id: string): Promise<User> {
    try {
      const response = await api.get<User>(`/admins/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create a new station admin (superadmin only)
   */
  async createAdmin(data: CreateAdminRequest): Promise<User> {
    try {
      const response = await api.post<User>('/admins/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update admin details (superadmin only)
   */
  async updateAdmin(id: string, data: UpdateAdminRequest): Promise<User> {
    try {
      const response = await api.put<User>(`/admins/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Deactivate admin (superadmin only)
   */
  async deactivateAdmin(id: string): Promise<User> {
    try {
      const response = await api.patch<User>(`/admins/${id}/deactivate/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Activate admin (superadmin only)
   */
  async activateAdmin(id: string): Promise<User> {
    try {
      const response = await api.patch<User>(`/admins/${id}/activate/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all regular users (superadmin only)
   */
  async getUsers(params?: {
    is_active?: boolean;
    search?: string;
    page?: number;
  }): Promise<User[]> {
    try {
      const response = await api.get<User[]>('/users/', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Deactivate user (superadmin only)
   */
  async deactivateUser(id: string): Promise<User> {
    try {
      const response = await api.patch<User>(`/users/${id}/deactivate/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Activate user (superadmin only)
   */
  async activateUser(id: string): Promise<User> {
    try {
      const response = await api.patch<User>(`/users/${id}/activate/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get super admin dashboard stats
   */
  async getSuperAdminStats(): Promise<{
    stats: {
      active_stations: number;
      total_parcels: number;
      total_revenue: number;
      delivery_success_rate: number;
    };
    recent_activity: Array<{
      type: string;
      message: string;
      timestamp: string;
    }>;
  }> {
    try {
      const response = await api.get('/dashboard/superadmin/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new AdminService();