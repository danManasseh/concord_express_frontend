import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { ArrowLeft, Package, Upload, X } from 'lucide-react';

const stations = [
  'Station A - Downtown',
  'Station B - Uptown',
  'Station C - East Side',
  'Station D - West Side',
  'Station E - North End',
  'Station F - South District',
];

export default function CreateDeliveryPage() {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const user = localStorage.getItem('user');
  if (!user) {
    navigate('/login');
    return null;
  }

  // Sender Information
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  
  // Recipient Information
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  
  // Stations
  const [originStation, setOriginStation] = useState('');
  const [destinationStation, setDestinationStation] = useState('');
  
  // Package Details
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [amount, setAmount] = useState(''); // New: Amount to pay
  const [deliveryType, setDeliveryType] = useState('standard');
  
  // Payment
  const [paymentResponsibility, setPaymentResponsibility] = useState('sender');
  
  // Photo Upload
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

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
    
    let paymentStatusValue = 'Pending'; // Default for customer portal
    // If sender pays, it's still pending until confirmed by admin (e.g., cash at station)
    // If receiver pays, it's pending until confirmed by admin

    const orderData = {
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
        amount: parseFloat(amount), // Store as number
        deliveryType,
        photo: photoPreview,
      },
      paymentResponsibility,
      paymentStatus: paymentStatusValue, // Always pending from customer side
      status: 'Payment Pending', // Initial status for customer orders
      createdAt: new Date().toISOString(),
    };

    console.log('Order created:', orderData);
    
    // Save to localStorage (temporary - will be replaced with API)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Navigate to confirmation page
    navigate(`/order-confirmation/${orderData.trackingId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Concord Express</h1>
            </Link>
            <Link to="/my-deliveries">
              <Button variant="ghost" size="sm">
                My Deliveries
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/my-deliveries')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Create Delivery Order
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to create a new parcel delivery
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
                  <Select value={originStation} onValueChange={setOriginStation} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select origin station" />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station} value={station}>
                          {station}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      {stations.map((station) => (
                        <SelectItem key={station} value={station}>
                          {station}
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

            {/* Payment Responsibility */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Who will pay for the delivery? <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup value={paymentResponsibility} onValueChange={setPaymentResponsibility}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sender" id="sender" />
                      <Label htmlFor="sender" className="font-normal cursor-pointer">
                        Sender (I will pay)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="receiver" id="receiver" />
                      <Label htmlFor="receiver" className="font-normal cursor-pointer">
                        Receiver (Recipient will pay)
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Order will be processed once package arrives at origin station and payment is confirmed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/my-deliveries')}
                className="h-11 flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Order
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
