import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Search, TrendingUp, CheckCircle, Plus, Loader2, Bell, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import parcelService from '@/services/parcel.service';
import { Parcel } from '@/types/parcel.types';

export default function MyDeliveriesPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch user's parcels
  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const data = await parcelService.getUserParcels();
        setParcels(data);
        setFilteredParcels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deliveries');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchParcels();
    }
  }, [user]);

  // Filter parcels
  useEffect(() => {
    let filtered = [...parcels];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.tracking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.recipient_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredParcels(filtered);
  }, [searchQuery, statusFilter, parcels]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  // Calculate stats
  const stats = {
    total: parcels.length,
    pending: parcels.filter((p) => p.payment_status === 'unpaid').length,
    inTransit: parcels.filter((p) => p.status === 'in_transit').length,
    delivered: parcels.filter((p) => p.status === 'delivered').length,
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-700';
      case 'in_transit':
        return 'bg-orange-100 text-orange-700';
      case 'arrived':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'unpaid':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Concord Express</h1>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/notifications')}>
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My Deliveries</h2>
          <p className="text-muted-foreground">Track and manage all your parcel deliveries</p>
        </div>

        {/* Create Button */}
        <div className="mb-6">
          <Button onClick={() => navigate('/create-delivery')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create New Delivery
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Transit
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.inTransit}</div>
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
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* All Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">All Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by tracking ID or recipient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px] h-11">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="created">Payment Pending</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="arrived">Arrived</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Deliveries List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredParcels.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No deliveries found matching your filters'
                    : 'No deliveries yet'}
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Button onClick={() => navigate('/create-delivery')}>
                    Create Your First Delivery
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredParcels.map((parcel) => (
                  <div
                    key={parcel.id}
                    className="border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                    onClick={() => navigate(`/track?code=${parcel.tracking_code}`)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-foreground">
                            {parcel.tracking_code}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                              parcel.status
                            )}`}
                          >
                            {parcel.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          <span className="font-medium">To:</span> {parcel.recipient_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Destination:</span>{' '}
                          {parcel.destination_station_name}
                        </p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(
                            parcel.payment_status
                          )}`}
                        >
                          {parcel.payment_status.toUpperCase()}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {new Date(parcel.created_at).toLocaleDateString()}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(
                              `${window.location.origin}/track?code=${parcel.tracking_code}`
                            );
                          }}
                        >
                          View Label
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}