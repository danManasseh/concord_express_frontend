import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  TrendingUp,
  CheckCircle,
  Clock,
  Users,
  MapPin,
  DollarSign,
  Plus,
  List,
  UserCog,
  Bell, // Ensure Bell is imported for the button
} from 'lucide-react';
import SuperAdminHeader from '@/components/superadmin/SuperAdminHeader'; // Import reusable header

export default function SuperAdminDashboardPage() {
  const navigate = useNavigate();
  const [superAdminData, setSuperAdminData] = useState<any>(null);

  useEffect(() => {
    const superadmin = localStorage.getItem('superadmin');
    if (!superadmin) {
      navigate('/superadmin/login');
      return;
    }
    setSuperAdminData(JSON.parse(superadmin));
  }, [navigate]);

  if (!superAdminData) return null;

  // Mock global stats
  const stats = {
    activeStations: 6,
    totalParcels: 250,
    totalRevenue: 15780.50,
    deliverySuccessRate: 96.2,
  };

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminHeader superAdminData={superAdminData} notificationCount={5} /> {/* Use reusable header */}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome, {superAdminData.name}
          </h2>
          <p className="text-muted-foreground">
            Global overview of Concord Express operations
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => navigate('/superadmin/stations')}
            className="h-20 text-lg"
          >
            <MapPin className="h-5 w-5 mr-2" />
            Manage Stations
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/admins')}
            className="h-20 text-lg"
          >
            <UserCog className="h-5 w-5 mr-2" />
            Manage Station Admins
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/parcels')}
            className="h-20 text-lg"
          >
            <List className="h-5 w-5 mr-2" />
            Global Parcel View
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/users')}
            className="h-20 text-lg"
          >
            <Users className="h-5 w-5 mr-2" />
            User Overview
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/payments')}
            className="h-20 text-lg"
          >
            <DollarSign className="h-5 w-5 mr-2" />
            Global Payments
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/reports')}
            className="h-20 text-lg"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Analytics & Reports
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/notifications')}
            className="h-20 text-lg"
          >
            <Bell className="h-5 w-5 mr-2" />
            Broadcast Message
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/superadmin/profile')}
            className="h-20 text-lg"
          >
            <UserCog className="h-5 w-5 mr-2" /> {/* Reusing UserCog for profile for now */}
            My Profile
          </Button>
        </div>

        {/* Global Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Stations
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.activeStations}</div>
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
              <div className="text-2xl font-bold text-foreground">{stats.totalParcels}</div>
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
              <div className="text-2xl font-bold text-foreground">${stats.totalRevenue.toFixed(2)}</div>
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
              <div className="text-2xl font-bold text-foreground">{stats.deliverySuccessRate}%</div>
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
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    New parcel TRK001008 created at Station E - North End
                  </p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Parcel TRK001004 delivered from Station C to Station A
                  </p>
                  <p className="text-xs text-muted-foreground">30 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    New Station Admin 'Jane Doe' created for Station F
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
