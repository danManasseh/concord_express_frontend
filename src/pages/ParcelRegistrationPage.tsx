import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Bell, ArrowLeft, Package } from 'lucide-react';

export default function ParcelRegistrationPage() {
  const navigate = useNavigate();
  
  // Sender Information
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  
  // Recipient Information
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [destinationStation, setDestinationStation] = useState('');
  
  // Package Details
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [deliveryType, setDeliveryType] = useState('standard');
  
  // Driver Assignment
  const [assignedDriver, setAssignedDriver] = useState('unassigned');
  
  // Payment Status
  const [paymentStatus, setPaymentStatus] = useState('unpaid');

  const generateTrackingId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TRK${timestamp}${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trackingId = generateTrackingId();
    
    const parcelData = {
      trackingId,
      sender: {
        name: senderName,
        phone: senderPhone,
        email: senderEmail,
      },
      recipient: {
        name: recipientName,
        phone: recipientPhone,
        destinationStation,
      },
      package: {
        description,
        weight: weight || 'Not specified',
        deliveryType,
      },
      assignedDriver: assignedDriver === 'unassigned' ? null : assignedDriver,
      paymentStatus,
      createdAt: new Date().toISOString(),
    };

    console.log('Parcel registered:', parcelData);
    
    // Future: Send notifications to sender & recipient
    alert(`Parcel registered successfully!\nTracking ID: ${trackingId}\n\nNotifications sent to sender and recipient.`);
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/">
                <h1 className="text-2xl font-bold text-foreground">VIP Express</h1>
              </Link>
              <nav className="flex items-center gap-6">
                <Link
                  to="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/parcel-registration"
                  className="text-primary font-medium border-b-2 border-primary pb-1"
                >
                  New Parcel
                </Link>
                <Link
                  to="/drivers"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Drivers
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">Station Manager</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  A
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Register New Parcel</h1>
              <p className="text-muted-foreground mt-1">
                Fill in the details to create a new parcel delivery
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="space-y-6">
            {/* Sender Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Sender Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senderName" className="text-sm font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="senderName"
                      type="text"
                      placeholder="Enter sender's name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senderPhone" className="text-sm font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="senderPhone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderEmail" className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    placeholder="Enter email address"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recipient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Recipient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName" className="text-sm font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="recipientName"
                      type="text"
                      placeholder="Enter recipient's name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientPhone" className="text-sm font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="recipientPhone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationStation" className="text-sm font-medium">
                    Destination Station <span className="text-red-500">*</span>
                  </Label>
                  <Select value={destinationStation} onValueChange={setDestinationStation} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select destination station" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Station A">Station A - Downtown</SelectItem>
                      <SelectItem value="Station B">Station B - Uptown</SelectItem>
                      <SelectItem value="Station C">Station C - East Side</SelectItem>
                      <SelectItem value="Station D">Station D - West Side</SelectItem>
                      <SelectItem value="Station E">Station E - North End</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Package Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the package contents"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-medium">
                    Weight (kg) <span className="text-muted-foreground text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="Enter package weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Delivery Type <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="font-normal cursor-pointer">
                        Standard (3-5 business days)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="font-normal cursor-pointer">
                        Express (1-2 business days)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="same-day" id="same-day" />
                      <Label htmlFor="same-day" className="font-normal cursor-pointer">
                        Same Day Delivery
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Driver Assignment & Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Assignment & Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedDriver" className="text-sm font-medium">
                    Assign Driver <span className="text-muted-foreground text-xs">(Optional)</span>
                  </Label>
                  <Select value={assignedDriver} onValueChange={setAssignedDriver}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned (Assign Later)</SelectItem>
                      <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                      <SelectItem value="Sarah Davis">Sarah Davis</SelectItem>
                      <SelectItem value="Tom Anderson">Tom Anderson</SelectItem>
                      <SelectItem value="Lisa Martinez">Lisa Martinez</SelectItem>
                      <SelectItem value="James Wilson">James Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Payment Status <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup value={paymentStatus} onValueChange={setPaymentStatus}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paid" id="paid" />
                      <Label htmlFor="paid" className="font-normal cursor-pointer">
                        Paid
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unpaid" id="unpaid" />
                      <Label htmlFor="unpaid" className="font-normal cursor-pointer">
                        Unpaid
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="h-11 px-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Register Parcel & Send Notifications
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
