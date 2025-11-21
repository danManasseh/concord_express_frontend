import api, { handleApiError } from './api';
import { User } from '@/types/user.types';

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
}

class ProfileService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/profile/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      const response = await api.patch<User>('/profile/', data);
      
      // Update localStorage with new user data
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        localStorage.setItem('user', JSON.stringify({ ...userData, ...response.data }));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    try {
      const response = await api.put('/auth/change-password/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await api.get<NotificationPreferences>('/profile/notifications/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    preferences: NotificationPreferences
  ): Promise<NotificationPreferences> {
    try {
      const response = await api.patch<NotificationPreferences>(
        '/profile/notifications/',
        preferences
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete account (optional - for users only)
   */
  async deleteAccount(password: string): Promise<{ message: string }> {
    try {
      const response = await api.delete('/profile/', {
        data: { password },
      });
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new ProfileService();