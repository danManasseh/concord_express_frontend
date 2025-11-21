import api, { handleApiError } from './api';
import { User } from '@/types/user.types';

/**
 * Authentication Types
 */
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  phone: string;
  email?: string;
  password: string;
  password_confirm: string;
}

// export interface User {
//   id: number;
//   name: string;
//   email: string | null;
//   phone: string;
//   role: 'user' | 'admin' | 'superadmin';
//   is_active: boolean;
//   station?: {
//     id: number;
//     name: string;
//     code: string;
//   } | null;
// }

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
  message: string;
}

class AuthService {
  /**
   * Login user
   * Backend: POST /api/auth/login/
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login/', data);
      
      // Store tokens (tokens are nested in response.tokens)
      localStorage.setItem('accessToken', response.data.tokens.access);
      localStorage.setItem('refreshToken', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Signup/Register user
   * Backend: POST /api/auth/register/
   */
  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register/', data);
      
      // Store tokens (tokens are nested in response.tokens)
      localStorage.setItem('accessToken', response.data.tokens.access);
      localStorage.setItem('refreshToken', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Logout user
   * Backend: POST /api/auth/logout/
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh_token: refreshToken });
      }
    } catch (error) {
      // Even if logout fails, clear local storage
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current user profile
   * Backend: GET /api/auth/me/
   */
  async getCurrentUserProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/me/');
      // Update stored user
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Change password
   * Backend: PUT /api/auth/change-password/
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await api.put('/auth/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: newPassword,
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Request password reset
   * Backend: POST /api/auth/password-reset/
   */
  async requestPasswordReset(phone: string): Promise<{ message: string; phone: string }> {
    try {
      const response = await api.post<{ message: string; phone: string }>(
        '/auth/password-reset/',
        { phone }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Confirm password reset with OTP
   * Backend: POST /api/auth/password-reset/confirm/
   */
  async confirmPasswordReset(
    phone: string,
    otp: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        '/auth/password-reset/confirm/',
        {
          phone,
          otp,
          new_password: newPassword,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  /**
   * Get user role
   */
  getUserRole(): 'user' | 'admin' | 'superadmin' | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: 'user' | 'admin' | 'superadmin'): boolean {
    return this.getUserRole() === role;
  }

  /**
   * Check if user is admin or superadmin
   */
  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'admin' || role === 'superadmin';
  }

  /**
   * Check if user is superadmin
   */
  isSuperAdmin(): boolean {
    return this.getUserRole() === 'superadmin';
  }
}

export default new AuthService();