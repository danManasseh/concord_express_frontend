/**
 * Dashboard-related type definitions
 */

export interface DashboardStats {
  stats: {
    in_transit: number;
    arrived: number;
    delivered_today: number;
    total_today: number;
  };
  recent_activity: Array<{
    type: string;
    message: string;
    timestamp: string;
    tracking_code?: string;
    batch_id?: string;
  }>;
}

export interface AdminDashboardStats extends DashboardStats {
  // Add any admin-specific stats here if needed
}

export interface SuperAdminDashboardStats {
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
    tracking_code?: string;
    batch_id?: string;
  }>;
}