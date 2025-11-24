import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  TrendingUp,
  CheckCircle,
  Clock,
  Plus,
  List,
  Truck,
  DollarSign,
  // Bell,
} from 'lucide-react';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import api from '@/services/api';
import { DataState } from '@/components/common/DataState';
import { DashboardStats } from '@/types/dashboard.types';
// import { getParcelStatusColor } from '@/lib/statusColors';


export default function AdminDashboardPage() {
  const user = useRoleGuard(['admin']);  // ← ADD THIS (replaces 8 lines!)
  const navigate = useNavigate();

  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
   // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.station?.id) return;

      try {
        const response = await api.get<DashboardStats>(
          `/stations/${user.station.id}/dashboard-stats/`
        );
        setStats(response.data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'parcel_created':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'parcel_delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'batch_departed':
        return <TrendingUp className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };
  if (!user) return null;


 return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminData={user} notificationCount={3} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name}
          </h2>
          <p className="text-muted-foreground">
            {user.station ? `${user.station.name} Station` : 'Station Admin Dashboard'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => navigate('/admin/create-parcel')}
            className="h-20 text-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Parcel
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/parcels')}
            className="h-20 text-lg"
          >
            <List className="h-5 w-5 mr-2" />
            View All Parcels
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/bus-arrival')}
            className="h-20 text-lg"
          >
            <Truck className="h-5 w-5 mr-2" />
            Bulk Update
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/payments')}
            className="h-20 text-lg"
          >
            <DollarSign className="h-5 w-5 mr-2" />
            Payments
          </Button>
        </div>

        {/* ✅ Section 4: DataState handles loading/error/empty */}
        <DataState
          isLoading={isLoading}
          error={error}
          data={stats}
          loadingText="Loading dashboard statistics..."
        >
          {stats && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      In Transit
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {stats.stats.in_transit}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Currently moving</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Arrived
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {stats.stats.arrived}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">At your station</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Delivered Today
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {stats.stats.delivered_today}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Today
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {stats.stats.total_today}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">All activities</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recent_activity.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No recent activity
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {stats.recent_activity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
                        >
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {activity.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {activity.tracking_code && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/parcels/${activity.tracking_code}`)
                              }
                            >
                              View
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </DataState>
      </div>
    </div>
  );
}