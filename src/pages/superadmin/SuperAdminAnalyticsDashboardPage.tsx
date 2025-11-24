import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  MapPin,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import SuperAdminHeader from '@/components/superadmin/SuperAdminHeader';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import analyticsService from '@/services/analyticsService';
import stationService from '@/services/station.service';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Station } from '@/types/user.types';

// Chart colors
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function SuperAdminAnalyticsDashboardPage() {
  const navigate = useNavigate();
  const user = useRoleGuard(['superadmin']);
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [parcelStats, setParcelStats] = useState<any>(null);
  const [stations, setStations] = useState<Station[]>([]);
  
  // Filters
  const [timeRange, setTimeRange] = useState('30');
  const [selectedStation, setSelectedStation] = useState('all');

  // Load static data (stations) once on mount
  useEffect(() => {
    const loadStations = async () => {
      try {
        const stationsData = await stationService.getStations();
        setStations(stationsData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load stations',
          variant: 'destructive',
        });
      }
    };
    
    loadStations();
  }, [toast]);

  // Load dynamic data when filters change
  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeRange));

        const params = {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          ...(selectedStation !== 'all' && { station_id: selectedStation }),
        };

        // ✅ Only call endpoints that exist
        const [dashboardStats, parcelData] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getParcelStats(params),
        ]);

        setStats(dashboardStats);
        setParcelStats(parcelData);
      } catch (error) {
        console.error('Analytics error:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load analytics data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, timeRange, selectedStation, toast]);

  // Prepare chart data
  const statusChartData = parcelStats?.by_status
    ? [
        { name: 'Pending', value: parcelStats.by_status.pending || 0, color: COLORS[2] },
        { name: 'In Transit', value: parcelStats.by_status.in_transit || 0, color: COLORS[0] },
        { name: 'Arrived', value: parcelStats.by_status.arrived || 0, color: COLORS[4] },
        { name: 'Delivered', value: parcelStats.by_status.delivered || 0, color: COLORS[1] },
        { name: 'Cancelled', value: parcelStats.by_status.cancelled || 0, color: COLORS[3] },
      ].filter(item => item.value > 0) // Only show statuses with data
    : [];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminHeader adminData={user} notificationCount={5} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/superadmin/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground">
                Comprehensive system performance and insights
              </p>
            </div>
          </div>
        </div>

        {/* Info Alert - Export Feature Coming Soon */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">Export Feature Coming Soon</p>
            <p className="text-xs text-blue-700 mt-1">
              Report export functionality will be available in the next update.
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Time Range
                </label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 3 Months</SelectItem>
                    <SelectItem value="365">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Station
                </label>
                <Select value={selectedStation} onValueChange={setSelectedStation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stations</SelectItem>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={String(station.id)}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading analytics data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Parcels
                      </p>
                      <p className="text-2xl font-bold mt-2">
                        {stats?.stats?.total_parcels || parcelStats?.total || 0}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold mt-2">
                        GH₵ {stats?.stats?.total_revenue?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Success Rate
                      </p>
                      <p className="text-2xl font-bold mt-2">
                        {stats?.stats?.delivery_success_rate?.toFixed(1) || 0}%
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Stations
                      </p>
                      <p className="text-2xl font-bold mt-2">
                        {stats?.stats?.active_stations || stations.filter(s => s.is_active).length || 0}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Parcel Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Parcel Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {statusChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No parcel data available for selected period
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Parcel Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Status Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium">Pending</span>
                      </div>
                      <span className="text-xl font-bold">
                        {parcelStats?.by_status?.pending || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">In Transit</span>
                      </div>
                      <span className="text-xl font-bold">
                        {parcelStats?.by_status?.in_transit || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">Arrived</span>
                      </div>
                      <span className="text-xl font-bold">
                        {parcelStats?.by_status?.arrived || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Delivered</span>
                      </div>
                      <span className="text-xl font-bold">
                        {parcelStats?.by_status?.delivered || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="font-medium">Cancelled</span>
                      </div>
                      <span className="text-xl font-bold">
                        {parcelStats?.by_status?.cancelled || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.recent_activity?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recent_activity.map((activity: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {activity.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No recent activity
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}