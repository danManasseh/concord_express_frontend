import api, { handleApiError } from './api';
import { DashboardStats } from '@/types/dashboard.types';

export interface ParcelStats {
  total: number;
  by_status: {
    pending: number;
    in_transit: number;
    arrived: number;
    delivered: number;
    cancelled: number;
  };
}

export interface UserStats {
  total_users: number;
  active_users: number;
  new_users_this_month: number;
}

class AnalyticsService {
  /**
   * Get super admin dashboard statistics
   * GET /api/dashboard/superadmin/
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<DashboardStats>('/dashboard/superadmin/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get parcel statistics
   * GET /api/admin/parcels/stats/
   * Can filter by date range and station
   */
  async getParcelStats(params?: {
    start_date?: string;
    end_date?: string;
    station_id?: string;
  }): Promise<ParcelStats> {
    try {
      const response = await api.get<ParcelStats>('/parcels/stats/', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user statistics
   * GET /api/admin/users/stats/
   */
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await api.get<UserStats>('/users/stats/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get station statistics
   * GET /api/stations/{id}/statistics/
   */
  async getStationStatistics(stationId: string, params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<any> {
    try {
      const response = await api.get(`/stations/${stationId}/statistics/`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new AnalyticsService();