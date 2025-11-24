import { PaginatedResponse } from '@/types/api.types';
import api, { handleApiError } from './api';

export interface Notification {
  id: string;
  user: string | null;
  user_name: string | null;
  recipient_phone: string | null;
  recipient_email: string | null;
  type: 'parcel_update' | 'payment_update' | 'admin_alert' | 'system';
  channel: 'sms' | 'email' | 'both';
  message: string;
  status: 'queued' | 'sent' | 'failed';
  parcel: string | null;
  parcel_tracking_code: string | null;
  error_message: string | null;
  created_at: string;
  sent_at: string | null;
}

export interface CreateNotificationRequest {
  user?: string;
  recipient_phone?: string;
  recipient_email?: string;
  type: 'parcel_update' | 'payment_update' | 'admin_alert' | 'system';
  channel: 'sms' | 'email' | 'both';
  message: string;
  parcel?: string;
}

export interface BroadcastNotificationRequest {
  user_ids?: string[];
  phone_numbers?: string[];
  message: string;
  type: 'admin_alert' | 'system';
  channel: 'sms' | 'email' | 'both';
}

class NotificationService {
  /**
   * Get all notifications (for current user or admin view)
   */
  async getNotifications(params?: {
    status?: string;
    type?: string;
    parcel?: string;
    page?: number;
  }): Promise<Notification[]> {
    try {
      const response = await api.get<PaginatedResponse<Notification>>('/notifications/', { params });
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get notification by ID
   */
  async getNotification(id: string): Promise<Notification> {
    try {
      const response = await api.get<Notification>(`/notifications/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create a notification
   */
  async createNotification(data: CreateNotificationRequest): Promise<Notification> {
    try {
      const response = await api.post<{ notification: Notification }>(
        '/notifications/create/',
        data
      );
      return response.data.notification;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Retry a failed notification
   */
  async retryNotification(notificationId: string): Promise<Notification> {
    try {
      const response = await api.post<{ notification: Notification }>(
        `/notifications/${notificationId}/retry/`
      );
      return response.data.notification;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get failed notifications
   */
  async getFailedNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get<Notification[]>('/notifications/failed/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Broadcast notification to multiple recipients (superadmin only)
   */
  async broadcastNotification(
    data: BroadcastNotificationRequest
  ): Promise<Notification[]> {
    try {
      const response = await api.post<{ notifications: Notification[] }>(
        '/notifications/broadcast/',
        data
      );
      return response.data.notifications;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Mark notification as read (for in-app notifications - future feature)
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.patch(`/notifications/${notificationId}/read/`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get unread notification count (for in-app notifications - future feature)
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get<{ count: number }>('/notifications/unread-count/');
      return response.data.count;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new NotificationService();