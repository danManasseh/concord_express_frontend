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
} from 'lucide-react';
import Header from '@/components/Header';

// Mock parcel data
const mockParcelData: Record<string, any> = {
  TRK001234: {
    trackingId: 'TRK001234',
    sender: {
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
    },
    recipient: {
      name: 'Jane Smith',
      phone: '+1 (555) 987-6543',
    },
    origin: 'Station A - Downtown',
    destination: 'Station B - Uptown',
    description: 'Electronics - Laptop and accessories',
    weight: '3.5 kg',
    deliveryType: 'Express',
    currentStatus: 'In Transit',
    paymentStatus: 'Paid',
    estimatedDelivery: '2024-01-16 03:00 PM',
    timeline: [
      {
        status: 'Created',
        timestamp: '2024-01-15 08:00 AM',
        location: 'Station A - Downtown',
        completed: true,
        description: 'Parcel registered and ready for pickup',
      },
      {
        status: 'Picked Up',
        timestamp: '2024-01-15 09:30 AM',
        location: 'Station A - Downtown',
        completed: true,
        description: 'Picked up by driver Mike Johnson',
      },
      {
        status: 'In Transit',
        timestamp: '2024-01-15 10:15 AM',
        location: 'En route to Station B',
        completed: true,
        description: 'Package is on the way to destination',
      },
      {
        status: 'Arrived',
        timestamp: 'Pending',
        location: 'Station B - Uptown',
        completed: false,
        description: 'Package will arrive at destination station',
      },
      {
        status: 'Delivered',
        timestamp: 'Pending',
        location: 'Station B - Uptown',
        completed: false,
        description: 'Package will be delivered to recipient',
      },
    ],
    alerts: [
      {
        type: 'info',
        message: 'Your package is on schedule for delivery',
        timestamp: '2024-01-15 10:15 AM',
      },
    ],
    requiresConfirmation: false, // Removed driver, so confirmation is not tied to driver
  },
  TRK001237: {
    trackingId: 'TRK001237',
    sender: {
      name: 'Eve Black',
      phone: '+1 (555) 234-5678',
    },
    recipient: {
      name: 'Frank Blue',
      phone: '+1 (555) 876-5432',
    },
    origin: 'Station C - East Side',
    destination: 'Station A - Downtown',
    description: 'Documents - Legal papers',
    weight: '0.5 kg',
    deliveryType: 'Standard',
    currentStatus: 'Arrived',
    paymentStatus: 'Paid',
    estimatedDelivery: '2024-01-15 05:00 PM',
    timeline: [
      {
        status: 'Created',
        timestamp: '2024-01-15 07:00 AM',
        location: 'Station C - East Side',
        completed: true,
        description: 'Parcel registered and ready for pickup',
      },
      {
        status: 'Picked Up',
        timestamp: '2024-01-15 08:00 AM',
        location: 'Station C - East Side',
        completed: true,
        description: 'Picked up by driver Tom Anderson',
      },
      {
        status: 'In Transit',
        timestamp: '2024-01-15 09:00 AM',
        location: 'En route to Station A',
        completed: true,
        description: 'Package is on the way to destination',
      },
      {
        status: 'Arrived',
        timestamp: '2024-01-15 02:30 PM',
        location: 'Station A - Downtown',
        completed: true,
        description: 'Package has arrived at destination station',
      },
      {
        status: 'Delivered',
        timestamp: 'Pending',
        location: 'Station A - Downtown',
        completed: false,
        description: 'Ready for recipient pickup',
      },
    ],
    alerts: [
      {
        type: 'success',
        message: 'Your package has arrived at the destination station',
        timestamp: '2024-01-15 02:30 PM',
      },
    ],
    requiresConfirmation: true,
  },
};

export default function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trackingIdInput, setTrackingIdInput] = useState(searchParams.get('id') || '');
  const [parcelData, setParcelData] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const fetchParcelData = (id: string) => {
    const data = mockParcelData[id.toUpperCase()];
    if (data) {
      setParcelData(data);
      setNotFound(false);
    } else {
      setParcelData(null);
      setNotFound(true);
    }
  };

  const handleTrackButtonClick = () => {
    if (trackingIdInput.trim()) {
      setSearchParams({ id: trackingIdInput.toUpperCase() });
    }
  };

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setTrackingIdInput(idFromUrl);
      fetchParcelData(idFromUrl);
    } else {
      setParcelData(null);
      setNotFound(false);
      setTrackingIdInput('');
    }
  }, [searchParams]);

  const handleConfirmDelivery = () => {
    if (otpCode.length === 6) {
      console.log('Delivery confirmed with OTP:', otpCode);
      alert('Delivery confirmed successfully!');
      setShowConfirmDialog(false);
      setOtpCode('');
      if (parcelData) {
        setParcelData({
          ...parcelData,
          currentStatus: 'Delivered',
          timeline: parcelData.timeline.map((item: any) =>
            item.status === 'Delivered'
              ? { ...item, completed: true, timestamp: new Date().toLocaleString() }
              : item
          ),
        });
      }
    }
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (!completed) {
      return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
    switch (status) {
      case 'Created':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'Picked Up':
        return <User className="h-5 w-5 text-purple-600" />;
      case 'In Transit':
        return <Truck className="h-5 w-5 text-orange-600" />;
      case 'Arrived':
        return <MapPin className="h-5 w-5 text-yellow-600" />;
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
                placeholder="Enter Tracking ID (e.g., TRK001234)"
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTrackButtonClick()}
                className="h-14 pl-12 text-base"
              />
            </div>
            <Button onClick={handleTrackButtonClick} className="h-14 px-8 text-base">
              Track Parcel
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
        {parcelData && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Alerts */}
            {parcelData.alerts && parcelData.alerts.length > 0 && (
              <div className="space-y-3">
                {parcelData.alerts.map((alert: any, index: number) => (
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
                      parcelData.currentStatus === 'Delivered'
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : parcelData.currentStatus === 'In Transit'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : parcelData.currentStatus === 'Arrived'
                        ? 'bg-orange-100 text-orange-800 border-orange-300'
                        : 'bg-gray-100 text-gray-800 border-gray-300'
                    }`}
                  >
                    {parcelData.currentStatus}
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
                        {parcelData.trackingId}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Sender
                      </h3>
                      <p className="text-base text-foreground">{parcelData.sender.name}</p>
                      <p className="text-sm text-muted-foreground">{parcelData.sender.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Recipient
                      </h3>
                      <p className="text-base text-foreground">{parcelData.recipient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {parcelData.recipient.phone}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Origin
                      </h3>
                      <p className="text-base text-foreground">{parcelData.origin}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Destination
                      </h3>
                      <p className="text-base text-foreground">{parcelData.destination}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        Description
                      </h3>
                      <p className="text-base text-foreground">{parcelData.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                          Weight
                        </h3>
                        <p className="text-base text-foreground">{parcelData.weight}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                          Delivery Type
                        </h3>
                        <p className="text-base text-foreground">{parcelData.deliveryType}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {parcelData.estimatedDelivery && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="text-lg font-semibold text-foreground">
                      {parcelData.estimatedDelivery}
                    </p>
                  </div>
                )}
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
                  {parcelData.timeline.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`rounded-full p-2 ${
                            item.completed ? 'bg-primary/10' : 'bg-muted'
                          }`}
                        >
                          {getStatusIcon(item.status, item.completed)}
                        </div>
                        {index < parcelData.timeline.length - 1 && (
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
            {parcelData.requiresConfirmation &&
              parcelData.currentStatus === 'Arrived' && (
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
        )}
      </div>

      {/* OTP Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delivery</DialogTitle>
            <DialogDescription>
              Enter the 6-digit OTP code provided by the driver to confirm delivery.
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
