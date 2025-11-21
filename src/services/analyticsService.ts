import api, { handleApiError } from './api';

export interface DashboardStats {
  stats: {
    active_stations: number;
    total_parcels: number;
    total_revenue: number;
    delivery_success_rate: number;
    parcels_in_transit?: number;
    parcels_delivered?: number;
    parcels_pending?: number;
    active_users?: number;
  };
  recent_activity: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
}

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

export interface RevenueStats {
  total: number;
  by_period: Array<{
    date: string;
    amount: number;
  }>;
}

export interface StationPerformance {
  station_id: string;
  station_name: string;
  total_parcels: number;
  delivered_parcels: number;
  success_rate: number;
}

class AnalyticsService {
  /**
   * Get super admin dashboard statistics
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
   * Can filter by date range
   */
  async getParcelStats(params?: {
    start_date?: string;
    end_date?: string;
    station_id?: string;
  }): Promise<ParcelStats> {
    try {
      const response = await api.get<ParcelStats>('/admin/parcels/stats/', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get revenue statistics
   */
  async getRevenueStats(params?: {
    start_date?: string;
    end_date?: string;
    station_id?: string;
  }): Promise<RevenueStats> {
    try {
      const response = await api.get<RevenueStats>('/admin/revenue/stats/', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    total_users: number;
    active_users: number;
    new_users_this_month: number;
  }> {
    try {
      const response = await api.get('/admin/users/stats/');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get station performance data
   */
  async getStationPerformance(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<StationPerformance[]> {
    try {
      const response = await api.get<StationPerformance[]>('/admin/stations/performance/', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Export analytics report
   */
  async exportReport(params: {
    report_type: 'delivery_performance' | 'revenue_summary' | 'station_performance' | 'user_activity';
    format: 'csv' | 'pdf';
    start_date?: string;
    end_date?: string;
    station_id?: string;
  }): Promise<Blob> {
    try {
      const response = await api.get('/admin/reports/export/', {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new AnalyticsService();