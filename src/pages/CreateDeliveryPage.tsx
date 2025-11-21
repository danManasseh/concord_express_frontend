import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package, Upload, X, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import parcelService from '@/services/parcel.service';
import stationService from '@/services/station.service';
import { Station } from '@/types/user.types';
import { CreateParcelRequest, DeliveryType, PaymentResponsibility } from '@/types/parcel.types';

export default function CreateDeliveryPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // States
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoadingStations, setIsLoadingStations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Sender Information (pre-fill from user data)
  const [senderName, setSenderName] = useState(user?.name || '');
  const [senderPhone, setSenderPhone] = useState(user?.phone || '');
  const [senderAddress, setSenderAddress] = useState('');
  
  // Recipient Information
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  
  // Stations
  const [originStation, setOriginStation] = useState('');
  const [destinationStation, setDestinationStation] = useState('');
  
  // Package Details
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [amount, setAmount] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('standard');
  
  // Payment
  const [paymentResponsibility, setPaymentResponsibility] = useState<PaymentResponsibility>('sender');
  
  // Photo Upload
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  // Fetch stations on mount
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await stationService.getStations();
        setStations(data);
      } catch (err) {
        console.error('Failed to load stations:', err);
        setError('Failed to load stations. Please refresh the page.');
      } finally {
        setIsLoadingStations(false);
      }
    };

    fetchStations();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Prepare parcel data matching backend serializer
      const parcelData: CreateParcelRequest = {
        sender_name: senderName,
        sender_phone: senderPhone,
        sender_address: senderAddress,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        recipient_address: recipientAddress,
        origin_station: originStation,
        destination_station: destinationStation,
        description: description,
        item_count: 1,
        weight: weight ? parseFloat(weight) : undefined,
        declared_value: parseFloat(amount),
        delivery_type: deliveryType,
        payment_status: 'unpaid', // Customer orders start as unpaid
        payment_responsibility: paymentResponsibility,
      };

      // Create parcel
      const createdParcel = await parcelService.createParcel(parcelData);

      // Upload photo if exists
      if (photo) {
        try {
          await parcelService.uploadPhoto(createdParcel.id, photo);
        } catch (photoErr) {
          console.error('Failed to upload photo:', photoErr);
          // Don't fail the entire order if photo upload fails
        }
      }

      // Navigate to confirmation page
      navigate(`/order-confirmation/${createdParcel.tracking_code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

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

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderAddress">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="senderAddress"
                    type="text"
                    placeholder="Enter sender's address"
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    required
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientAddress">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="recipientAddress"
                    type="text"
                    placeholder="Enter recipient's address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    required
                    disabled={isSubmitting}
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
                  <Select 
                    value={originStation} 
                    onValueChange={setOriginStation} 
                    required
                    disabled={isLoadingStations || isSubmitting}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={isLoadingStations ? "Loading stations..." : "Select origin station"} />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name} ({station.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationStation">
                    Destination Station <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={destinationStation} 
                    onValueChange={setDestinationStation} 
                    required
                    disabled={isLoadingStations || isSubmitting}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={isLoadingStations ? "Loading stations..." : "Select destination station"} />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          {station.name} ({station.code})
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    Declared Value (GHS) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="Enter package value"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Delivery Type <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup 
                    value={deliveryType} 
                    onValueChange={(value) => setDeliveryType(value as DeliveryType)}
                    disabled={isSubmitting}
                  >
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
                      <RadioGroupItem value="same_day" id="same_day" />
                      <Label htmlFor="same_day" className="font-normal cursor-pointer">
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                  <RadioGroup 
                    value={paymentResponsibility} 
                    onValueChange={(value) => setPaymentResponsibility(value as PaymentResponsibility)}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sender" id="sender" />
                      <Label htmlFor="sender" className="font-normal cursor-pointer">
                        Sender (I will pay)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recipient" id="recipient" />
                      <Label htmlFor="recipient" className="font-normal cursor-pointer">
                        Recipient (Recipient will pay)
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
                disabled={isSubmitting}
                className="h-11 flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoadingStations}
                className="h-11 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Order...
                  </>
                ) : (
                  'Create Order'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}