import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Plus,
  Search,
  Bell,
  User,
  TrendingUp,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import parcelService from '@/services/parcel.service';
import { Parcel } from '@/types/parcel.types';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

export default function MyDeliveriesPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notificationCount] = useState(3); // TODO: Get from API

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch user's parcels
  useEffect(() => {
    const fetchParcels = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const data = await parcelService.getUserParcels();
        setParcels(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load deliveries',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchParcels();
  }, [user, toast]);

  if (!user) return null;

  // Map backend status to display format
  const getDisplayStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      created: 'Pending',
      in_transit: 'In Transit',
      arrived: 'Arrived at Destination',
      delivered: 'Delivered',
      failed: 'Failed',
    };
    return statusMap[status] || status;
  };

  // Get status badge color (matching original design)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'arrived':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Filter parcels
  const filteredParcels = parcels.filter((parcel) => {
    const matchesSearch =
      parcel.tracking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.recipient_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || parcel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: parcels.length,
    pending: parcels.filter((p) => p.status === 'created').length,
    inTransit: parcels.filter((p) => p.status === 'in_transit').length,
    delivered: parcels.filter((p) => p.status === 'delivered').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header/>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              My Deliveries
            </h1>
            <p className="text-muted-foreground">
              Track and manage all your parcel deliveries
            </p>
          </div>
          <Button
            onClick={() => navigate('/create-delivery')}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Delivery
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
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
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
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

        {/* Filters and Orders List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              All Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tracking ID or recipient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="created">Pending</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="arrived">Arrived</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading deliveries...</span>
              </div>
            ) : filteredParcels.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No deliveries found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {parcels.length === 0
                    ? "You haven't created any deliveries yet"
                    : 'Try adjusting your search or filters'}
                </p>
                {parcels.length === 0 && (
                  <Button onClick={() => navigate('/create-delivery')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Delivery
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredParcels.map((parcel) => (
                  <div
                    key={parcel.id}
                    className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Tracking ID</p>
                            <p className="font-mono font-bold text-foreground">
                              {parcel.tracking_code}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={getStatusColor(parcel.status)}
                          >
                            {getDisplayStatus(parcel.status)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Recipient</p>
                            <p className="text-foreground">{parcel.recipient_name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Destination</p>
                            <p className="text-foreground">{parcel.destination_station_name}</p>
                          </div>
                          {/* <div>
                            <p className="text-xs text-muted-foreground">Amount</p>
                            <p className="text-foreground">
                              GHS {parcel.amount ? parcel.amount.toFixed(2) : '0.00'}
                            </p>
                          </div> */}
                          <div>
                            <p className="text-xs text-muted-foreground">Payment</p>
                            <p className="text-foreground capitalize">
                              {parcel.payment_status === 'paid' ? 'Paid' : 
                               parcel.payment_status === 'pending' ? 'Pending' : 'Unpaid'}
                            </p>
                          </div>
                          <div className="text-sm">
                          <p className="text-xs text-muted-foreground">Created</p>
                          <p className="text-foreground">
                            {new Date(parcel.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        </div>

                      
                      </div>

                      <div className="flex sm:flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/track?code=${parcel.tracking_code}`)}
                          className="flex-1 sm:flex-none"
                        >
                          Track
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/order-confirmation/${parcel.tracking_code}`)
                          }
                          className="flex-1 sm:flex-none"
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