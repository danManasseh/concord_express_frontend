import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, Truck, Package, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import batchService, { Batch } from '@/services/batch.service';
import { useRoleGuard } from '@/hooks/useRoleGuard';

export default function AdminBusArrivalPage() {
  const navigate = useNavigate();
  const user = useRoleGuard(['admin'])

  const [batchId, setBatchId] = useState('');
  const [batch, setBatch] = useState<Batch | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!batchId.trim()) {
      setError('Please enter a batch identifier');
      return;
    }

    setIsSearching(true);
    setError('');
    setSuccessMessage('');
    setBatch(null);

    try {
      const data = await batchService.searchBatch(batchId.trim());
      
      // Check if batch can be marked as arrived
      if (data.status === 'arrived') {
        setError('This batch has already been marked as arrived.');
        setBatch(data);
      } else if (data.status === 'pending') {
        setError('This batch has not departed yet. It cannot be marked as arrived.');
        setBatch(data);
      } else if (data.status === 'cancelled') {
        setError('This batch has been cancelled.');
        setBatch(data);
      } else {
        setBatch(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch not found');
    } finally {
      setIsSearching(false);
    }
  };

  const handleMarkAsArrived = async () => {
    if (!batch) return;

    setIsUpdating(true);
    setError('');

    try {
      await batchService.arriveBatch(
        batch.id,
        `Batch arrived at ${user?.station?.name || 'station'}`
      );
      
      setSuccessMessage(
        `Successfully updated ${batch.parcel_count} parcel(s) to "Arrived" status!`
      );
      
      // Refresh batch data
      const updatedBatch = await batchService.getBatch(batch.id);
      setBatch(updatedBatch);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update batch');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = () => {
    setBatchId('');
    setBatch(null);
    setError('');
    setSuccessMessage('');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminData={user} notificationCount={3} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Bus Arrival / Bulk Update
          </h1>
          <p className="text-muted-foreground">
            Update multiple parcels to "Arrived" status upon truck arrival at{' '}
            {user.station?.name || 'your station'}
          </p>
        </div>

        {/* Search Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Enter Truck/Batch Identifier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batchId">Batch Identifier</Label>
                <div className="flex gap-2">
                  <Input
                    id="batchId"
                    type="text"
                    placeholder="e.g., TRK-BATCH-001 or ACC-KSI-20251120-1234"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    disabled={isSearching || !!batch}
                    className="h-11"
                  />
                  {batch ? (
                    <Button type="button" onClick={handleReset} variant="outline" className="h-11">
                      Reset
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSearching} className="h-11 px-8">
                      {isSearching ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Find Parcels
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Batch Details */}
        {batch && (
          <>
            {/* Batch Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Batch Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Batch ID</p>
                    <p className="font-semibold">{batch.batch_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <span
                      className={`inline-block text-xs px-2 py-1 rounded-full ${
                        batch.status === 'arrived'
                          ? 'bg-green-100 text-green-700'
                          : batch.status === 'in_transit'
                          ? 'bg-blue-100 text-blue-700'
                          : batch.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {batch.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Origin</p>
                    <p className="font-semibold">
                      {batch.origin_station_name} ({batch.origin_station_code})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Destination</p>
                    <p className="font-semibold">
                      {batch.destination_station_name} ({batch.destination_station_code})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Trip Date</p>
                    <p className="font-semibold">
                      {new Date(batch.trip_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Parcels</p>
                    <p className="font-semibold">{batch.parcel_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parcels List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Parcels in this Batch ({batch.parcel_count})</span>
                  {batch.status === 'in_transit' && (
                    <Button onClick={handleMarkAsArrived} disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark All as Arrived
                        </>
                      )}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {batch.parcels.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">No parcels in this batch</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {batch.parcels.map((parcel) => (
                      <div
                        key={parcel.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold text-sm">{parcel.tracking_code}</p>
                            <p className="text-xs text-muted-foreground">
                              {parcel.sender_name} → {parcel.recipient_name}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            parcel.status === 'arrived'
                              ? 'bg-green-100 text-green-700'
                              : parcel.status === 'in_transit'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {parcel.status.toUpperCase().replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Empty State */}
        {!batch && !isSearching && !error && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Truck className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Batch Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Enter a truck/batch identifier above to find and update parcels
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
