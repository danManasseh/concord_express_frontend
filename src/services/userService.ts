import api, { handleApiError } from './api';
import { User } from '@/types/user.types';


// export interface User {
//   id: string;
//   name: string;
//   email: string | null;
//   phone: string;
//   role: 'user' | 'admin' | 'superadmin';
//   station: string | null;
//   station_name?: string;
//   station_code?: string;
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
// }

export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

class UserService {
  /**
   * Get all users (customers only - role='user')
   * Only accessible by Super Admin
   */
  async getAllUsers(params?: {
    search?: string;
    is_active?: boolean;
    page?: number;
  }): Promise<UserListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Filter to only get customers (role='user')
      queryParams.append('role', 'user');
      
      if (params?.search) {
        queryParams.append('search', params.search);
      }
      
      if (params?.is_active !== undefined) {
        queryParams.append('is_active', params.is_active.toString());
      }
      
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }

      const response = await api.get<UserListResponse>(`/users/?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get a specific user by ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get<User>(`/users/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Activate a user
   * PATCH /api/users/:id/activate/
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
   * Deactivate a user
   * PATCH /api/users/:id/deactivate/
   */
  async deactivateUser(id: string): Promise<User> {
    try {
      const response = await api.patch<User>(`/users/${id}/deactivate/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new UserService();