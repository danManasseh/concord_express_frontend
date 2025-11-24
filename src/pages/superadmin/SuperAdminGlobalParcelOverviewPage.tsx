import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Package,
  Search,
  Eye,
  Download,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import parcelService from '@/services/parcel.service';
import stationService from '@/services/station.service';
import { Parcel } from '@/types/parcel.types';
import { Station } from '@/types/user.types';
import { useToast } from '@/hooks/use-toast';
import SuperAdminHeader from '@/components/superadmin/SuperAdminHeader';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { getParcelStatusColor, getPaymentStatusColor, formatStatusText } from '@/lib/statusColors'; // ✅ ADD THIS

export default function SuperAdminGlobalParcelOverviewPage() {
  const navigate = useNavigate();
  const user = useRoleGuard(['superadmin']);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [originFilter, setOriginFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [parcelsData, stationsData] = await Promise.all([
          parcelService.getParcels(),
          stationService.getStations(),
        ]);
        setParcels(Array.isArray(parcelsData) ? parcelsData : parcelsData.results || []);
        setStations(stationsData);
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, toast]);

  // ❌ REMOVED getStatusColor - using utility
  // ❌ REMOVED getPaymentStatusColor - using utility
  // ❌ REMOVED getDisplayStatus - using formatStatusText utility

  const filteredParcels = parcels.filter((parcel) => {
    const matchesSearch =
      parcel.tracking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.recipient_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || parcel.status === statusFilter;
    const matchesOrigin =
      originFilter === 'all' || parcel.origin_station.toString() === originFilter;
    const matchesDestination =
      destinationFilter === 'all' || parcel.destination_station.toString() === destinationFilter;
    return matchesSearch && matchesStatus && matchesOrigin && matchesDestination;
  });

  // Calculate stats
  const stats = {
    total: parcels.length,
    pending: parcels.filter((p) => p.status === 'created').length,
    inTransit: parcels.filter((p) => p.status === 'in_transit').length,
    delivered: parcels.filter((p) => p.status === 'delivered').length,
  };

  const handleExport = () => {
    const headers = [
      'Tracking Code',
      'Sender',
      'Recipient',
      'Origin',
      'Destination',
      'Status',
      'Payment Status',
      'Date',
    ];
    const rows = filteredParcels.map((p) => [
      p.tracking_code,
      p.sender_name,
      p.recipient_name,
      p.origin_station_name,
      p.destination_station_name,
      formatStatusText(p.status), // ✅ Use utility
      p.payment_status,
      new Date(p.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parcels-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: 'Success',
      description: 'Parcel data exported successfully',
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminHeader adminData={user} notificationCount={0} />
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/superadmin/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Global Parcel Overview
          </h1>
          <p className="text-muted-foreground">
            View and manage all parcels across the entire Concord Express network
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Parcels
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

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">All Parcels</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tracking ID, sender, or recipient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="created">Payment Pending</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="arrived">Arrived</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={originFilter} onValueChange={setOriginFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by origin station" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Origins</SelectItem>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={String(station.id)}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by destination station" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={String(station.id)}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Parcels List/Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading parcels...</span>
              </div>
            ) : filteredParcels.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No parcels found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : isMobile ? (
              // Mobile Card View
              <div className="space-y-4">
                {filteredParcels.map((parcel) => (
                  <div
                    key={parcel.id}
                    className="border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Tracking ID</p>
                        <p className="font-mono font-bold text-foreground">
                          {parcel.tracking_code}
                        </p>
                      </div>
                      <Badge variant="outline" className={getParcelStatusColor(parcel.status)}>
                        {formatStatusText(parcel.status)}
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
                        <p className="text-foreground">{parcel.origin_station_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Destination</p>
                        <p className="text-foreground">{parcel.destination_station_name}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-foreground">
                          {parcel.delivery_fee ? `GHS ${parseFloat(parcel.delivery_fee).toFixed(2)}` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Payment</p>
                        <Badge
                          variant="outline"
                          className={`${getPaymentStatusColor(
                            parcel.payment_status
                          )} text-xs`}
                        >
                          {parcel.payment_status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/admin/parcels/${parcel.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop Table View
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Tracking ID</TableHead>
                      <TableHead className="font-semibold">Sender</TableHead>
                      <TableHead className="font-semibold">Recipient</TableHead>
                      <TableHead className="font-semibold">Origin</TableHead>
                      <TableHead className="font-semibold">Destination</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Payment</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParcels.map((parcel) => (
                      <TableRow key={parcel.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{parcel.tracking_code}</TableCell>
                        <TableCell>{parcel.sender_name}</TableCell>
                        <TableCell>{parcel.recipient_name}</TableCell>
                        <TableCell>{parcel.origin_station_name}</TableCell>
                        <TableCell>{parcel.destination_station_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getParcelStatusColor(parcel.status)}>
                            {formatStatusText(parcel.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {parcel.delivery_fee ? `GHS ${parseFloat(parcel.delivery_fee).toFixed(2)}` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getPaymentStatusColor(parcel.payment_status)}
                          >
                            {parcel.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                navigate(`/admin/parcels/${parcel.id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}