import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  CheckCircle,
  AlertCircle,
  User,
  MapPin,
  Pen,
} from 'lucide-react';

// Mock parcel data for confirmation
const mockParcelForConfirmation: Record<string, any> = {
  TRK001234: {
    trackingId: 'TRK001234',
    sender: 'John Doe',
    recipient: 'Jane Smith',
    origin: 'Station A - Downtown',
    destination: 'Station B - Uptown',
    description: 'Electronics - Laptop and accessories',
    driver: 'Mike Johnson',
    status: 'Arrived',
  },
  TRK001237: {
    trackingId: 'TRK001237',
    sender: 'Eve Black',
    recipient: 'Frank Blue',
    origin: 'Station C - East Side',
    destination: 'Station A - Downtown',
    description: 'Documents - Legal papers',
    driver: 'Tom Anderson',
    status: 'Arrived',
  },
};

export default function DeliveryConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [parcelData, setParcelData] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [confirmationMethod, setConfirmationMethod] = useState<'otp' | 'signature'>('otp');
  const [otpCode, setOtpCode] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [recipientName, setRecipientName] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSearch = () => {
    if (trackingId.trim()) {
      const data = mockParcelForConfirmation[trackingId.toUpperCase()];
      if (data && data.status === 'Arrived') {
        setParcelData(data);
        setNotFound(false);
        setRecipientName(data.recipient);
      } else {
        setParcelData(null);
        setNotFound(true);
      }
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = e.currentTarget;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = e.currentTarget;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
    const canvas = e.currentTarget;
    setSignatureData(canvas.toDataURL());
  };

  const handleClearSignature = () => {
    const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureData('');
      }
    }
  };

  const handleConfirmDelivery = async () => {
    setIsConfirming(true);

    // Validate based on confirmation method
    if (confirmationMethod === 'otp') {
      if (otpCode.length !== 6) {
        alert('Please enter a valid 6-digit OTP code');
        setIsConfirming(false);
        return;
      }
    } else {
      if (!signatureData) {
        alert('Please provide your signature');
        setIsConfirming(false);
        return;
      }
    }

    if (!recipientName.trim()) {
      alert('Please enter recipient name');
      setIsConfirming(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const confirmationData = {
        trackingId: parcelData.trackingId,
        confirmationMethod,
        otpCode: confirmationMethod === 'otp' ? otpCode : null,
        signature: confirmationMethod === 'signature' ? signatureData : null,
        recipientName,
        confirmedAt: new Date().toISOString(),
      };

      console.log('Delivery confirmed:', confirmationData);

      // Show success message
      alert(
        `Delivery confirmed successfully!\n\nTracking ID: ${parcelData.trackingId}\nRecipient: ${recipientName}\n\nNotifications sent to sender and admin.`
      );

      setIsConfirming(false);

      // Redirect to tracking page
      navigate(`/track?id=${parcelData.trackingId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="text-2xl font-bold text-foreground">VIP Express</h1>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Delivery Confirmation</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Confirm parcel receipt to complete the delivery
            </p>
          </div>

          {/* Search Section */}
          {!parcelData && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Enter Tracking ID
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="trackingId">Tracking ID</Label>
                    <Input
                      id="trackingId"
                      type="text"
                      placeholder="Enter tracking ID (e.g., TRK001234)"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="h-12 text-base"
                    />
                  </div>
                  <Button onClick={handleSearch} className="w-full h-11">
                    Search Parcel
                  </Button>
                  {notFound && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <p className="text-sm text-red-800">
                        Parcel not found or not ready for confirmation. Please check the
                        tracking ID.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Parcel Details & Confirmation */}
          {parcelData && (
            <div className="space-y-6">
              {/* Parcel Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-foreground">
                      Parcel Information
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-orange-100 text-orange-800 border-orange-300"
                    >
                      {parcelData.status}
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
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Sender
                        </h3>
                        <p className="text-base text-foreground">{parcelData.sender}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Recipient
                        </h3>
                        <p className="text-base text-foreground">{parcelData.recipient}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Origin
                        </h3>
                        <p className="text-base text-foreground">{parcelData.origin}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Destination
                        </h3>
                        <p className="text-base text-foreground">{parcelData.destination}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Description
                        </h3>
                        <p className="text-base text-foreground">{parcelData.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Driver:</strong> {parcelData.driver}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Confirmation Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Confirmation Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Choose confirmation method <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={confirmationMethod}
                      onValueChange={(value) => setConfirmationMethod(value as 'otp' | 'signature')}
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/30 cursor-pointer">
                        <RadioGroupItem value="otp" id="otp" />
                        <Label htmlFor="otp" className="font-normal cursor-pointer flex-1">
                          <div>
                            <p className="font-semibold">OTP Verification</p>
                            <p className="text-sm text-muted-foreground">
                              Enter the 6-digit code provided by the driver
                            </p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/30 cursor-pointer">
                        <RadioGroupItem value="signature" id="signature" />
                        <Label htmlFor="signature" className="font-normal cursor-pointer flex-1">
                          <div>
                            <p className="font-semibold">Digital Signature</p>
                            <p className="text-sm text-muted-foreground">
                              Sign on the pad to confirm receipt
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* OTP Input */}
                  {confirmationMethod === 'otp' && (
                    <div className="space-y-2">
                      <Label htmlFor="otp-code">
                        OTP Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="otp-code"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otpCode}
                        onChange={(e) =>
                          setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                        }
                        maxLength={6}
                        className="text-center text-2xl tracking-widest font-mono h-14"
                      />
                      <p className="text-xs text-muted-foreground">
                        Ask the driver for the OTP code to confirm delivery
                      </p>
                    </div>
                  )}

                  {/* Signature Pad */}
                  {confirmationMethod === 'signature' && (
                    <div className="space-y-2">
                      <Label>
                        Digital Signature <span className="text-red-500">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/10">
                        <canvas
                          id="signature-canvas"
                          width={600}
                          height={200}
                          className="w-full bg-white rounded cursor-crosshair"
                          onMouseDown={handleCanvasMouseDown}
                          onMouseMove={handleCanvasMouseMove}
                          onMouseUp={handleCanvasMouseUp}
                          onMouseLeave={handleCanvasMouseUp}
                        />
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Pen className="h-3 w-3" />
                            Sign above to confirm receipt
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleClearSignature}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recipient Name */}
                  <div className="space-y-2">
                    <Label htmlFor="recipient-name">
                      Recipient Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="recipient-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      Confirm your identity as the recipient
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Confirmation Actions */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setParcelData(null);
                    setTrackingId('');
                    setOtpCode('');
                    setRecipientName('');
                    handleClearSignature();
                  }}
                  className="h-11 px-8"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelivery}
                  disabled={isConfirming}
                  className="h-11 px-8 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isConfirming ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Delivery
                    </>
                  )}
                </Button>
              </div>

              {/* Info Notice */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> By confirming delivery, you acknowledge that you have
                  received the parcel in good condition. Notifications will be sent to the
                  sender and admin.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
