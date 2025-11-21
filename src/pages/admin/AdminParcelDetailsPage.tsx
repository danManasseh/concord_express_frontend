import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Package, MapPin, User, DollarSign, Calendar, Edit } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuthStore } from '@/stores/authStore';
import parcelService from '@/services/parcel.service';
import { ParcelDetail } from '@/types/parcel.types';

export default function AdminParcelDetailsPage() {
  const navigate = useNavigate();
  const { trackingId } = useParams<{ trackingId: string }>();
  const { user } = useAuthStore();

  const [parcel, setParcel] = useState<ParcelDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  // Fetch parcel details
  useEffect(() => {
    const fetchParcel = async () => {
      if (!trackingId) return;

      try {
        const data = await parcelService.trackParcel(trackingId);
        setParcel(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load parcel details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParcel();
  }, [trackingId]);

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-700';
      case 'in_transit':
        return 'bg-purple-100 text-purple-700';
      case 'arrived':
        return 'bg-orange-100 text-orange-700';
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
      <AdminHeader adminData={user} notificationCount={3} />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button variant="ghost" onClick={() => navigate('/admin/parcels')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Parcel Management
        </Button>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : parcel ? (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Parcel Details: {parcel.tracking_code}
                </h1>
                <p className="text-muted-foreground">
                  View and update details for this parcel
                </p>
              </div>
              <Button onClick={() => navigate(`/admin/parcels/${trackingId}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Parcel
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Summary */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Summary</CardTitle>
                    <Badge className={getStatusColor(parcel.status)}>
                      {parcel.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tracking ID</p>
                        <p className="font-semibold font-mono">{parcel.tracking_code}</p>
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
                        <p className="text-sm text-muted-foreground mb-1">Sender Name</p>
                        <p className="font-semibold">{parcel.sender_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Recipient Name</p>
                        <p className="font-semibold">{parcel.recipient_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Origin Station</p>
                        <p className="font-semibold">
                          {parcel.origin_station_name} ({parcel.origin_station_code})
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Destination Station</p>
                        <p className="font-semibold">
                          {parcel.destination_station_name} ({parcel.destination_station_code})
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Package Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Package Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Description</p>
                        <p className="text-sm">{parcel.description}</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-semibold mb-2">Sender</p>
                        <div className="space-y-1">
                          <p className="text-sm">{parcel.sender_name}</p>
                          <p className="text-sm text-muted-foreground">{parcel.sender_phone}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Recipient</p>
                        <div className="space-y-1">
                          <p className="text-sm">{parcel.recipient_name}</p>
                          <p className="text-sm text-muted-foreground">{parcel.recipient_phone}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {parcel.delivery_updates.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No updates yet</p>
                    ) : (
                      <div className="space-y-4">
                        {parcel.delivery_updates.map((update, index) => (
                          <div key={update.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="h-3 w-3 rounded-full bg-primary" />
                              {index < parcel.delivery_updates.length - 1 && (
                                <div className="w-0.5 h-full bg-border" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <p className="font-semibold text-sm">
                                {update.new_status.replace('_', ' ').toUpperCase()}
                              </p>
                              <p className="text-xs text-muted-foreground mb-1">
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
                              {update.actor_name && (
                                <p className="text-xs text-muted-foreground">
                                  By: {update.actor_name}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Package Photos */}
                {parcel.photos && parcel.photos.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Package Photos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {parcel.photos.map((photo) => (
                          <div key={photo.id} className="relative aspect-square">
                            <img
                              src={photo.photo_url}
                              alt="Package"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status & Payment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status & Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Current Status</p>
                      <Badge className={`${getStatusColor(parcel.status)} px-3 py-1`}>
                        {parcel.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        Only relevant admin can update certain statuses
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
                      <Badge className={`${getPaymentStatusColor(parcel.payment_status || 'unpaid')} px-3 py-1`}>
                        {(parcel.payment_status || 'unpaid').toUpperCase()}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        Current payment option: receiver pays
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate(`/admin/payments?parcel=${parcel.tracking_code}`)}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      View Payments
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/track?code=${parcel.tracking_code}`
                        );
                      }}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Copy Tracking Link
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
