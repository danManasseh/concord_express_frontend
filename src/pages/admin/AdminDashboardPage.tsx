import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  TrendingUp,
  CheckCircle,
  Clock,
  Bell,
  User,
  LogOut,
  Plus,
  List,
  Truck,
  DollarSign, // Added DollarSign icon import
} from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    setAdminData(JSON.parse(admin));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  if (!adminData) return null;

  // Mock stats - in real app, these would be filtered by station
  const stats = {
    inTransit: 12,
    arrived: 8,
    delivered: 45,
    totalToday: 65,
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminData={adminData} notificationCount={3} /> {/* Use reusable header */}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome back, {adminData.name}
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening at {adminData.stationName} today
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
            Manage Parcels
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/bus-arrival')}
            className="h-20 text-lg"
          >
            <Truck className="h-5 w-5 mr-2" />
            Bus Arrival / Bulk Update
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/payments')}
            className="h-20 text-lg"
          >
            <DollarSign className="h-5 w-5 mr-2" />
            Payment Records
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Transit
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.inTransit}</div>
              <p className="text-xs text-muted-foreground mt-1">From this station</p>
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
              <div className="text-2xl font-bold text-foreground">{stats.arrived}</div>
              <p className="text-xs text-muted-foreground mt-1">At this station</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Delivered
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.delivered}</div>
              <p className="text-xs text-muted-foreground mt-1">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Today
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalToday}</div>
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
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    New parcel created - TRK1234567890
                  </p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Parcel TRK1234567891 delivered
                  </p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Truck #TR-001 departed with 15 parcels
                  </p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
