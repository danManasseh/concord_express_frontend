import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Package,
  MapPin,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Search,
  Loader2,
} from 'lucide-react';
import Header from '@/components/Header';
import parcelService from '@/services/parcel.service';
import { ParcelDetail } from '@/types/parcel.types';
import { useToast } from '@/hooks/use-toast';

export default function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [trackingIdInput, setTrackingIdInput] = useState(searchParams.get('code') || '');
  const [parcelData, setParcelData] = useState<ParcelDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Fetch parcel data from API
  const fetchParcelData = async (code: string) => {
    if (!code.trim()) return;

    setIsLoading(true);
    setNotFound(false);
    setParcelData(null);

    try {
      const data = await parcelService.trackParcel(code.trim());
      setParcelData(data);
      setNotFound(false);
    } catch (error) {
      setParcelData(null);
      setNotFound(true);
      toast({
        title: 'Not Found',
        description: error instanceof Error ? error.message : 'Tracking ID not found',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackButtonClick = () => {
    if (trackingIdInput.trim()) {
      setSearchParams({ code: trackingIdInput.trim() });
      fetchParcelData(trackingIdInput.trim());
    }
  };

  // Auto-load parcel data from URL on mount
  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setTrackingIdInput(codeFromUrl);
      fetchParcelData(codeFromUrl);
    } else {
      setParcelData(null);
      setNotFound(false);
      setTrackingIdInput('');
    }
  }, [searchParams]);

  const handleConfirmDelivery = () => {
    if (otpCode.length === 6) {
      // TODO: Implement actual OTP verification with backend
      console.log('Delivery confirmed with OTP:', otpCode);
      toast({
        title: 'Success',
        description: 'Delivery confirmed successfully!',
      });
      setShowConfirmDialog(false);
      setOtpCode('');
      
      // Refresh parcel data
      if (parcelData) {
        fetchParcelData(parcelData.tracking_code);
      }
    }
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (!completed) {
      return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
    switch (status) {
      case 'created':
      case 'Created':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'Picked Up':
        return <User className="h-5 w-5 text-purple-600" />;
      case 'in_transit':
      case 'In Transit':
        return <Truck className="h-5 w-5 text-orange-600" />;
      case 'arrived':
      case 'Arrived':
        return <MapPin className="h-5 w-5 text-yellow-600" />;
      case 'delivered':
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  // Map backend status to display status
  const getDisplayStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      created: 'Created',
      in_transit: 'In Transit',
      arrived: 'Arrived',
      delivered: 'Delivered',
      failed: 'Failed',
    };
    return statusMap[status] || status;
  };

  // Build timeline from backend data
  const buildTimeline = () => {
    if (!parcelData) return [];

    const statusOrder = ['created', 'in_transit', 'arrived', 'delivered'];
    const currentStatusIndex = statusOrder.indexOf(parcelData.status);

    return statusOrder.map((status, index) => {
      const update = parcelData.delivery_updates?.find((u) => u.new_status === status);
      const completed = index <= currentStatusIndex;
      
      return {
        status: getDisplayStatus(status),
        timestamp: update
          ? new Date(update.timestamp).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Pending',
        location:
          status === 'created' || status === 'Picked Up'
            ? `${parcelData.origin_station_name}`
            : status === 'in_transit'
            ? `En route to ${parcelData.destination_station_name}`
            : `${parcelData.destination_station_name}`,
        completed,
        description: update?.notes || getDefaultDescription(status, parcelData),
      };
    });
  };

  const getDefaultDescription = (status: string, parcel: ParcelDetail) => {
    switch (status) {
      case 'created':
        return 'Parcel registered and ready for pickup';
      case 'in_transit':
        return 'Package is on the way to destination';
      case 'arrived':
        return 'Package has arrived at destination station';
      case 'delivered':
        return 'Package delivered to recipient';
      default:
        return '';
    }
  };

  // Generate alerts from parcel data
  const getAlerts = () => {
    if (!parcelData) return [];

    const alerts = [];

    if (parcelData.status === 'in_transit') {
      alerts.push({
        type: 'info',
        message: 'Your package is on schedule for delivery',
        timestamp: new Date().toLocaleString(),
      });
    }

    if (parcelData.status === 'arrived') {
      alerts.push({
        type: 'success',
        message: 'Your package has arrived at the destination station',
        timestamp: new Date().toLocaleString(),
      });
    }

    return alerts;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-6 py-12">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Track Your Parcel</h1>
            <p className="text-lg text-muted-foreground">
              Enter your tracking ID to see real-time updates
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter Tracking ID (e.g., VXP-20251120-1234)"
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrackButtonClick()}
                className="h-14 pl-12 text-base"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleTrackButtonClick}
              className="h-14 px-8 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Tracking...
                </>
              ) : (
                'Track Parcel'
              )}
            </Button>
          </div>
          {notFound && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-800">
                Tracking ID not found. Please check and try again.
              </p>
            </div>
          )}
        </div>

        {/* Parcel Details */}
        {parcelData && (() => {
          const timeline = buildTimeline();
          const alerts = getAlerts();
          
          return (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Alerts */}
              {alerts.length > 0 && (
              <div className="space-y-3">
                {alerts.map((alert: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border flex items-start gap-3 ${
                      alert.type === 'success'
                        ? 'bg-green-50 border-green-200'
                        : alert.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-200'
                        : alert.type === 'error'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

              {/* Parcel Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Parcel Details
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`text-base px-4 py-1 ${
                      parcelData.status === 'delivered'
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : parcelData.status === 'in_transit'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : parcelData.status === 'arrived'
                        ? 'bg-orange-100 text-orange-800 border-orange-300'
                        : 'bg-gray-100 text-gray-800 border-gray-300'
                    }`}
                  >
                    {getDisplayStatus(parcelData.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Tracking ID
                      </h3>
                      <p className="text-lg font-mono font-bold text-foreground">
                        {parcelData.tracking_code}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Sender
                      </h3>
                      <p className="text-base text-foreground">{parcelData.sender_name}</p>
                      <p className="text-sm text-muted-foreground">{parcelData.sender_phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Recipient
                      </h3>
                      <p className="text-base text-foreground">{parcelData.recipient_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {parcelData.recipient_phone}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Origin
                      </h3>
                      <p className="text-base text-foreground">
                        {parcelData.origin_station_name} ({parcelData.origin_station_code})
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Destination
                      </h3>
                      <p className="text-base text-foreground">
                        {parcelData.destination_station_name} ({parcelData.destination_station_code})
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Description
                      </h3>
                      <p className="text-base text-foreground">{parcelData.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {parcelData.weight && (
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                            Weight
                          </h3>
                          <p className="text-base text-foreground">{parcelData.weight} kg</p>
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                          Delivery Type
                        </h3>
                        <p className="text-base text-foreground capitalize">
                          {parcelData.delivery_type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-lg font-semibold text-foreground">
                    {new Date(parcelData.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Delivery Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timeline.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`rounded-full p-2 ${
                            item.completed ? 'bg-primary/10' : 'bg-muted'
                          }`}
                        >
                          {getStatusIcon(item.status, item.completed)}
                        </div>
                        {index < timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-16 ${
                              item.completed ? 'bg-primary' : 'bg-border'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-1">
                          <h3
                            className={`text-lg font-semibold ${
                              item.completed ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {item.status}
                          </h3>
                          <span
                            className={`text-sm ${
                              item.completed ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{item.location}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Confirmation */}
            {parcelData.status === 'arrived' && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Ready for Pickup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Your parcel has arrived at the destination station. Click below to
                    confirm delivery with OTP.
                  </p>
                  <Button
                    onClick={() => setShowConfirmDialog(true)}
                    className="w-full md:w-auto"
                  >
                    Confirm Delivery
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          );
        })()}
      </div>

      {/* OTP Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delivery</DialogTitle>
            <DialogDescription>
              Enter the 6-digit OTP code provided by the station staff to confirm delivery.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                setOtpCode('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmDelivery} disabled={otpCode.length !== 6}>
              Confirm Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}