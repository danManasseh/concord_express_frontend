import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Plus, Loader2, Eye, Package } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuthStore } from '@/stores/authStore';
import parcelService from '@/services/parcel.service';
import { Parcel } from '@/types/parcel.types';

export default function AdminParcelManagementPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  // Handle window resize for responsive view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch parcels
  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const data = await parcelService.getParcels();
        setParcels(data.results || data);
        setFilteredParcels(data.results || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load parcels');
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
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.tracking_code.toLowerCase().includes(query) ||
          p.sender_name.toLowerCase().includes(query) ||
          p.recipient_name.toLowerCase().includes(query)
      );
    }

    setFilteredParcels(filtered);
  }, [searchQuery, statusFilter, parcels]);

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'arrived':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Smart "next action" logic based on station and status
  const getNextStatusAction = (
  parcel: Parcel
): { label: string; newStatus: 'created' | 'in_transit' | 'arrived' | 'delivered' | 'failed' } | null => {
  const currentStation = user?.station?.id;
  const isOriginStation = parcel.origin_station === String(currentStation);
  const isDestinationStation = parcel.destination_station === String(currentStation);

  // Only allow status updates if payment is paid
  if (parcel.payment_status !== 'paid') {
    return null;
  }

  switch (parcel.status) {
    case 'created':
      if (isOriginStation) return { label: 'Mark In Transit', newStatus: 'in_transit' };
      break;
    case 'in_transit':
      if (isDestinationStation) return { label: 'Mark as Arrived', newStatus: 'arrived' };
      break;
    case 'arrived':
      if (isDestinationStation) return { label: 'Mark as Delivered', newStatus: 'delivered' };
      break;
    default:
      return null;
  }
  return null;
};

  const updateParcelStatus = async (
  parcelId: string, 
  newStatus: 'created' | 'in_transit' | 'arrived' | 'delivered' | 'failed',
  notes?: string
) => {
  try {
    // Call API to update status - pass an object with new_status and notes
    await parcelService.updateParcelStatus(parcelId, {
      new_status: newStatus,
      notes: notes || `Status updated to ${newStatus.replace('_', ' ')}`
    });
    
    // Update local state
    setParcels(prevParcels =>
      prevParcels.map(p =>
        p.id === parcelId ? { ...p, status: newStatus } : p
      )
    );
    
    console.log(`Parcel ${parcelId} status updated to ${newStatus}`);
  } catch (err) {
    console.error('Failed to update status:', err);
  }
};

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminData={user} notificationCount={3} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Parcel Management
            </h1>
            <p className="text-muted-foreground">
              View and manage all parcels for {user.station?.name}
            </p>
          </div>
          <Button onClick={() => navigate('/admin/create-parcel')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create New Parcel
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Station Parcels */}
        <Card>
          <CardHeader>
            <CardTitle>Station Parcels</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by tracking ID, sender, or recipient..."
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
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="arrived">Arrived</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Parcels List - Mobile Cards / Desktop Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredParcels.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No parcels found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create a new parcel to get started'}
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Button onClick={() => navigate('/admin/create-parcel')}>
                    Create First Parcel
                  </Button>
                )}
              </div>
            ) : isMobile ? (
              /* MOBILE VIEW - Cards */
              <div className="space-y-4">
                {filteredParcels.map((parcel) => (
                  <div
                    key={parcel.id}
                    className="border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Tracking ID</p>
                        <p className="font-mono font-bold text-foreground">{parcel.tracking_code}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(parcel.status)}>
                        {parcel.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Sender</p>
                        <p className="text-foreground">{parcel.sender_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Recipient</p>
                        <p className="text-foreground">{parcel.recipient_name}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Origin</p>
                        <p className="text-foreground">{parcel.origin_station_code}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Destination</p>
                        <p className="text-foreground">{parcel.destination_station_code}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-foreground">GHS {parcel.declared_value}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Payment</p>
                        <Badge variant="outline" className={`${getPaymentStatusColor(parcel.payment_status)} text-xs`}>
                          {parcel.payment_status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/admin/parcels/${parcel.tracking_code}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {getNextStatusAction(parcel) && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            updateParcelStatus(
                              parcel.id,
                              getNextStatusAction(parcel)!.newStatus
                            )
                          }
                        >
                          {getNextStatusAction(parcel)!.label}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* DESKTOP VIEW - Table */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Tracking ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Sender
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Recipient
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Origin
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Destination
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Payment
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Amount
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParcels.map((parcel) => (
                      <tr
                        key={parcel.id}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium font-mono">{parcel.tracking_code}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{parcel.sender_name}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{parcel.recipient_name}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{parcel.origin_station_code}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{parcel.destination_station_code}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={getStatusColor(parcel.status)}>
                            {parcel.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={getPaymentStatusColor(parcel.payment_status)}>
                            {parcel.payment_status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">GHS {parcel.declared_value}</p>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => navigate(`/parcels/${parcel.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {getNextStatusAction(parcel) && (
                              <Button
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() =>
                                  updateParcelStatus(
                                    parcel.id,
                                    getNextStatusAction(parcel)!.newStatus
                                  )
                                }
                              >
                                {getNextStatusAction(parcel)!.label}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
