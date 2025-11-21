import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Search, CheckCircle2, Loader2, AlertCircle, MapPin } from 'lucide-react';
import parcelService from '@/services/parcel.service';
import { ParcelDetail } from '@/types/parcel.types';

export default function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingCode, setTrackingCode] = useState(searchParams.get('code') || '');
  const [parcel, setParcel] = useState<ParcelDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-search if tracking code in URL
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      setTrackingCode(code);
      handleSearch(code);
    }
  }, []);

  const handleSearch = async (code?: string) => {
    const searchCode = code || trackingCode;
    if (!searchCode.trim()) {
      setError('Please enter a tracking code');
      return;
    }

    setIsLoading(true);
    setError('');
    setParcel(null);

    try {
      const data = await parcelService.trackParcel(searchCode.trim());
      setParcel(data);
      setSearchParams({ code: searchCode.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Parcel not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // Timeline status rendering
  const getStatusIcon = (status: string, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
    if (isCurrent) {
      return (
        <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-blue-100 animate-pulse" />
      );
    }
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300 bg-white" />;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      created: 'Created',
      in_transit: 'In Transit',
      arrived: 'Arrived',
      delivered: 'Delivered',
      failed: 'Failed',
    };
    return labels[status] || status;
  };

  const statusFlow = ['created', 'in_transit', 'arrived', 'delivered'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Concord Express</h1>
            </Link>
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Track Your Parcel
            </h2>
            <p className="text-muted-foreground">
              Enter your tracking ID to see real-time updates
            </p>
          </div>

          {/* Search Box */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter tracking code (e.g., VXP-20251120-1234)"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="h-12 px-8">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Track Parcel'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Parcel Details */}
          {parcel && (
            <>
              {/* Status Alert */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  📦 Your package is{' '}
                  <span className="font-semibold">{getStatusLabel(parcel.status)}</span>
                </p>
                {parcel.status === 'arrived' && (
                  <p className="text-xs text-blue-700 mt-1">
                    Ready for pickup at {parcel.destination_station_name}
                  </p>
                )}
              </div>

              {/* Parcel Info Card */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Parcel Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tracking ID</p>
                      <p className="font-semibold">{parcel.tracking_code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Created At</p>
                      <p className="font-semibold">
                        {new Date(parcel.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Sender</p>
                      <p className="font-semibold">{parcel.sender_name}</p>
                      <p className="text-sm text-muted-foreground">{parcel.sender_phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Recipient</p>
                      <p className="font-semibold">{parcel.recipient_name}</p>
                      <p className="text-sm text-muted-foreground">{parcel.recipient_phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Origin</p>
                      <p className="font-semibold">
                        {parcel.origin_station_name} ({parcel.origin_station_code})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Destination</p>
                      <p className="font-semibold">
                        {parcel.destination_station_name} ({parcel.destination_station_code})
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{parcel.description}</p>
                    </div>
                    {parcel.weight && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Weight</p>
                        <p className="font-semibold">{parcel.weight} kg</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Delivery Type</p>
                      <p className="font-semibold capitalize">
                        {parcel.delivery_type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {statusFlow.map((status, index) => {
                      const update = parcel.delivery_updates.find((u) => u.new_status === status);
                      const isCompleted = !!update;
                      const isCurrent = status === parcel.status && !isCompleted;
                      const isPending = statusFlow.indexOf(status) > statusFlow.indexOf(parcel.status);

                      return (
                        <div key={status} className="flex gap-4">
                          {/* Icon */}
                          <div className="flex flex-col items-center">
                            {getStatusIcon(status, isCompleted, isCurrent)}
                            {index < statusFlow.length - 1 && (
                              <div
                                className={`w-0.5 h-12 ${
                                  isCompleted ? 'bg-green-600' : 'bg-gray-300'
                                }`}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-6">
                            <div className="flex items-center justify-between mb-1">
                              <p
                                className={`font-semibold ${
                                  isCompleted || isCurrent
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {getStatusLabel(status)}
                              </p>
                              {isCurrent && (
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                  Current
                                </span>
                              )}
                              {isPending && (
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                  Pending
                                </span>
                              )}
                            </div>

                            {update && (
                              <>
                                <p className="text-sm text-muted-foreground mb-1">
                                  {new Date(update.timestamp).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                                {update.notes && (
                                  <p className="text-sm text-muted-foreground">{update.notes}</p>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Help Text */}
          {!parcel && !isLoading && !error && (
            <div className="text-center mt-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Enter your tracking code above to see your parcel's journey
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
