import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, X } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader'; // Import reusable header

const allStations = [
  { id: 'station-a', name: 'Station A - Downtown' },
  { id: 'station-b', name: 'Station B - Uptown' },
  { id: 'station-c', name: 'Station C - East Side' },
  { id: 'station-d', name: 'Station D - West Side' },
  { id: 'station-e', name: 'Station E - North End' },
  { id: 'station-f', name: 'Station F - South District' },
];

export default function AdminCreateParcelPage() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    const parsedAdmin = JSON.parse(admin);
    setAdminData(parsedAdmin);
    setOriginStation(parsedAdmin.stationName); // Default origin to admin's station
  }, [navigate]);

  // Sender Information
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  
  // Recipient Information
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  
  // Stations
  const [originStation, setOriginStation] = useState(''); // Will be set by useEffect
  const [destinationStation, setDestinationStation] = useState('');
  
  // Package Details
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [deliveryType, setDeliveryType] = useState('standard');
  const [amount, setAmount] = useState(''); // New: Amount to pay
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  // Admin-specific fields
  // const [assignedDriver, setAssignedDriver] = useState('unassigned'); // Removed for now
  const [paymentOption, setPaymentOption] = useState('sender_cash'); // New: Who pays & how
  const [truckIdentifier, setTruckIdentifier] = useState('');
  const [initialParcelStatus, setInitialParcelStatus] = useState('Payment Pending'); // New: Initial status

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let paymentStatusValue = 'Pending';
    if (paymentOption === 'sender_cash') {
      paymentStatusValue = 'Paid';
    }

    const newParcel = {
      trackingId: `TRK${Date.now()}`,
      sender: {
        name: senderName,
        phone: senderPhone,
        email: senderEmail,
      },
      recipient: {
        name: recipientName,
        phone: recipientPhone,
        email: recipientEmail,
      },
      originStation,
      destinationStation,
      package: {
        description,
        weight: weight || 'Not specified',
        deliveryType,
        amount: parseFloat(amount), // Store as number
        photo: photoPreview,
      },
      // assignedDriver: assignedDriver === 'unassigned' ? null : assignedDriver, // Removed
      paymentStatus: paymentStatusValue,
      paymentOption, // Store the chosen payment option
      truckIdentifier: truckIdentifier || null,
      status: initialParcelStatus,
      createdAt: new Date().toISOString(),
    };

    console.log('New Parcel Created by Admin:', newParcel);
    
    // In a real app, this would be an API call to add the parcel
    // For now, we'll just alert and navigate
    alert(`Parcel ${newParcel.trackingId} created successfully!`);
    navigate('/admin/parcels');
  };

  if (!adminData) return null;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminData={adminData} notificationCount={3} /> {/* Use reusable header */}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/parcels')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Parcel Management
          </Button>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Create New Parcel (Walk-in)
            </h1>
            <p className="text-muted-foreground">
              Manually log a new parcel into the system for walk-in customers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sender Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Sender Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senderName">
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
                  <Label htmlFor="senderPhone">
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
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">
                    Email <span className="text-muted-foreground text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    placeholder="Enter email address"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recipient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recipient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName">
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
                  <Label htmlFor="recipientPhone">
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
                <div className="space-y-2">
                  <Label htmlFor="recipientEmail">
                    Email <span className="text-muted-foreground text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="Enter email address"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Delivery Stations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="originStation">
                    Origin Station <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="originStation"
                    type="text"
                    value={originStation}
                    readOnly
                    className="h-11 bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is your assigned station and cannot be changed.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationStation">
                    Destination Station <span className="text-red-500">*</span>
                  </Label>
                  <Select value={destinationStation} onValueChange={setDestinationStation} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select destination station" />
                    </SelectTrigger>
                    <SelectContent>
                      {allStations.map((station) => (
                        <SelectItem key={station.id} value={station.name}>
                          {station.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Package Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">
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
                  <Label htmlFor="weight">
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
                  <Label htmlFor="amount">
                    Amount to Pay ($) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
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

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="photo">
                    Package Photo <span className="text-muted-foreground text-xs">(Optional)</span>
                  </Label>
                  {!photoPreview ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <label htmlFor="photo" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload package photo
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Package preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={removePhoto}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Assignment & Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Payment & Initial Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Removed Assigned Driver */}
                <div className="space-y-2">
                  <Label>
                    Payment Option <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup value={paymentOption} onValueChange={setPaymentOption}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sender_cash" id="sender_cash" />
                      <Label htmlFor="sender_cash" className="font-normal cursor-pointer">
                        Sender Pays (Cash at Station)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sender_mobile" id="sender_mobile" />
                      <Label htmlFor="sender_mobile" className="font-normal cursor-pointer">
                        Sender Pays (Mobile Money - Pending)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="receiver_pays" id="receiver_pays" />
                      <Label htmlFor="receiver_pays" className="font-normal cursor-pointer">
                        Receiver Pays (Mobile Money - Pending)
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground">
                    Note: Parcel status will be 'Payment Pending' until payment is confirmed,
                    unless sender pays cash immediately.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="truckIdentifier">
                    Truck/Batch Identifier <span className="text-muted-foreground text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="truckIdentifier"
                    type="text"
                    placeholder="e.g., TRK-BATCH-001"
                    value={truckIdentifier}
                    onChange={(e) => setTruckIdentifier(e.target.value)}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Assign a batch ID for bulk updates upon arrival.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialParcelStatus">
                    Initial Parcel Status <span className="text-red-500">*</span>
                  </Label>
                  <Select value={initialParcelStatus} onValueChange={setInitialParcelStatus} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select initial status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Payment Pending">Payment Pending</SelectItem>
                      <SelectItem value="Pending Pickup">Pending Pickup</SelectItem>
                      <SelectItem value="Picked Up">Picked Up</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Arrived">Arrived</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Set the initial status. If payment is pending, it should be 'Payment Pending'.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/parcels')}
                className="h-11 flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Parcel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
