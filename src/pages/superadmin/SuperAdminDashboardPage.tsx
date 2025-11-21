import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MapPin,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Settings,
  BarChart3,
  Bell,
  Loader2,
} from 'lucide-react';
import SuperAdminHeader from '@/components/superadmin/SuperAdminHeader';
import { useAuthStore } from '@/stores/authStore';
import adminService from '@/services/admin.service';

export default function SuperAdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not superadmin
  useEffect(() => {
    if (!user || user.role !== 'superadmin') {
      navigate('/superadmin/login');
    }
  }, [user, navigate]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getSuperAdminStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (!user) return null;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'parcel_created':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'parcel_delivered':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'admin_created':
        return <Users className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'parcel_created':
        return 'bg-blue-100';
      case 'parcel_delivered':
        return 'bg-green-100';
      case 'admin_created':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminHeader adminData={user} notificationCount={5} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome, {user.name}
          </h2>
          <p className="text-muted-foreground">
            Global overview of Concord Express operations
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/stations')}
            className="h-20 text-base"
          >
            <MapPin className="h-5 w-5 mr-2" />
            Manage Stations
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/admins')}
            className="h-20 text-base"
          >
            <Users className="h-5 w-5 mr-2" />
            Manage Station Admins
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/parcels')}
            className="h-20 text-base"
          >
            <Package className="h-5 w-5 mr-2" />
            Global Parcel View
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/users')}
            className="h-20 text-base"
          >
            <Users className="h-5 w-5 mr-2" />
            User Overview
          </Button>
        </div>

        {/* Additional Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/payments')}
            className="h-16"
          >
            <DollarSign className="h-5 w-5 mr-2" />
            Global Payments
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/reports')}
            className="h-16"
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            Analytics & Reports
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/notifications')}
            className="h-16"
          >
            <Bell className="h-5 w-5 mr-2" />
            Broadcast Message
          </Button>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Stations
                  </CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.stats.active_stations}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Parcels
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.stats.total_parcels}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    GHS {stats.stats.total_revenue.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Delivery Success Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.stats.delivery_success_rate}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Global Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Recent Global Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recent_activity.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-4">
                    {stats.recent_activity.map((activity: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
                      >
                        <div
                          className={`h-10 w-10 rounded-full ${getActivityBgColor(
                            activity.type
                          )} flex items-center justify-center`}
                        >
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
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}