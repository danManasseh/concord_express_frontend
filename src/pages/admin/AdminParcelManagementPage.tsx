import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Plus, Eye, Package } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useIsMobile } from '@/hooks/use-mobile';
import parcelService from '@/services/parcel.service';
import { Parcel } from '@/types/parcel.types';
import { getParcelStatusColor, formatStatusText } from '@/lib/statusColors';
import { DataState } from '@/components/common/DataState';


export default function AdminParcelManagementPage() {
  const navigate = useNavigate();
  const user = useRoleGuard(['admin']); // ✅ Section 1: Auth guard
  const isMobile = useIsMobile(); // ✅ Section 2: Mobile detection

  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');


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

  useEffect(() => {
    let filtered = [...parcels];

    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

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
  }, [parcels, searchQuery, statusFilter]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminData={user} notificationCount={3} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Parcel Management
            </h1>
            <p className="text-muted-foreground">Manage all parcels at your station</p>
          </div>
          <Button onClick={() => navigate('/admin/create-parcel')}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Parcel
          </Button>
        </div>
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tracking code, sender, or recipient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
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
          </CardContent>
        </Card>

        {/* ✅ Section 4: DataState replaces manual loading/error/empty checks */}
        <DataState
          isLoading={isLoading}
          error={error}
          data={filteredParcels}
          loadingText="Loading parcels..."
          emptyText="No parcels found. Create your first parcel to get started."
        >
          {/* Mobile View - Cards */}
          {isMobile ? (
            <div className="space-y-4">
              {filteredParcels.map((parcel) => (
                <Card key={parcel.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-mono text-sm font-semibold text-foreground">
                          {parcel.tracking_code}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(parcel.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {/* ✅ Section 3: Using statusColors utility */}
                      <Badge className={getParcelStatusColor(parcel.status)}>
                        {formatStatusText(parcel.status)}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">From:</span>{' '}
                        <span className="font-medium">{parcel.sender_name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">To:</span>{' '}
                        <span className="font-medium">{parcel.recipient_name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Destination:</span>{' '}
                        <span className="font-medium">{parcel.destination_station_name}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(`/parcels/${parcel.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Desktop View - Table */
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Tracking Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Sender
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Recipient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Destination
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {filteredParcels.map((parcel) => (
                        <tr key={parcel.id} className="hover:bg-muted/30">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Package className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="font-mono text-sm font-medium">
                                {parcel.tracking_code}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {parcel.sender_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {parcel.recipient_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {parcel.destination_station_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {/* ✅ Section 3: Using statusColors utility */}
                            <Badge className={getParcelStatusColor(parcel.status)}>
                              {formatStatusText(parcel.status)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(parcel.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/parcels/${parcel.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </DataState>
      </div>
    </div>
  );
}
