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
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useToast } from '@/hooks/use-toast';
import parcelService from '@/services/parcel.service';
import stationService from '@/services/station.service';
import { Station } from '@/types/user.types';
import { CreateParcelRequest, DeliveryType, PaymentResponsibility } from '@/types/parcel.types';

export default function AdminCreateParcelPage() {
  const navigate = useNavigate();
  const user = useRoleGuard(['admin']);
  const { toast } = useToast();

  // States
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoadingStations, setIsLoadingStations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sender Information
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  
  // Recipient Information
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  
  // Stations - Store UUIDs
  const [destinationStation, setDestinationStation] = useState('');
  
  // Package Details
  const [description, setDescription] = useState('');
  const [itemCount, setItemCount] = useState('1');
  const [weight, setWeight] = useState('');
  const [declaredValue, setDeclaredValue] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('standard');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  // Admin-specific fields
  const [paymentResponsibility, setPaymentResponsibility] = useState<PaymentResponsibility>('sender');
  const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'pending' | 'paid'>('pending');

  // Fetch stations on mount
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await stationService.getStations();
        setStations(data);
      } catch (error) {
        console.error('Failed to load stations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load stations. Please refresh the page.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingStations(false);
      }
    };

    fetchStations();
  }, [toast]);

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
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!user?.station?.id) {
        throw new Error('Your station information is missing. Please contact support.');
      }

      if (!destinationStation) {
        throw new Error('Please select a destination station.');
      }

      // Build the request payload
      const parcelData: CreateParcelRequest = {
        sender_name: senderName,
        sender_phone: senderPhone,
        sender_address: senderAddress || '', // Empty string if not provided
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        recipient_address: recipientAddress || '', // Empty string if not provided
        origin_station: String(user.station.id), // ✅ UUID from user's station
        destination_station: destinationStation, // ✅ UUID from dropdown
        description: description,
        item_count: parseInt(itemCount) || 1,
        weight: weight ? parseFloat(weight) : undefined,
        declared_value: parseFloat(declaredValue),
        delivery_type: deliveryType,
        payment_status: paymentStatus,
        payment_responsibility: paymentResponsibility,
      };

      // Create parcel via API
      const createdParcel = await parcelService.createParcel(parcelData);

      // Upload photo if exists
      if (photo) {
        try {
          await parcelService.uploadPhoto(createdParcel.id, photo);
        } catch (photoErr) {
          console.error('Failed to upload photo:', photoErr);
          // Don't fail the entire operation if photo upload fails
          toast({
            title: 'Warning',
            description: 'Parcel created but photo upload failed.',
            variant: 'destructive',
          });
        }
      }

      // Show success message
      toast({
        title: 'Success',
        description: `Parcel created successfully!`,
      });

      // Navigate back to parcels page
      navigate('/admin/parcels');
      
    } catch (error) {
      console.error('Failed to create parcel:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create parcel. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminData={user} notificationCount={3} />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/parcels')}
            className="mb-4"
            disabled={isSubmitting}
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
                    Address <span className="text-muted-foreground text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="senderAddress"
                    type="text"
                    placeholder="Enter sender's address"
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
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
                    Address <span className="text-muted-foreground text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="recipientAddress"
                    type="text"
                    placeholder="Enter recipient's address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
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
                  <Input
                    id="originStation"
                    type="text"
                    value={user?.station?.name || ''}
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
                  <Select 
                    value={destinationStation} 
                    onValueChange={setDestinationStation} 
                    required
                    disabled={isLoadingStations || isSubmitting}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={
                        isLoadingStations 
                          ? "Loading stations..." 
                          : "Select destination station"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {stations.map((station) => (
                        <SelectItem key={station.id} value={station.id.toString()}>
                          {station.name} - {station.region}
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
                    Description 
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemCount">
                      Number of Items <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="itemCount"
                      type="number"
                      min="1"
                      placeholder="e.g., 1"
                      value={itemCount}
                      onChange={(e) => setItemCount(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="h-11"
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
                      placeholder="Enter weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      disabled={isSubmitting}
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="declaredValue">
                    Declared Value (GHS) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="declaredValue"
                    type="number"
                    step="0.01"
                    placeholder="Enter package value"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
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

            {/* Payment & Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Payment Responsibility <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup 
                    value={paymentResponsibility} 
                    onValueChange={(value) => setPaymentResponsibility(value as PaymentResponsibility)}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sender" id="sender_pays" />
                      <Label htmlFor="sender_pays" className="font-normal cursor-pointer">
                        Sender Pays
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recipient" id="recipient_pays" />
                      <Label htmlFor="recipient_pays" className="font-normal cursor-pointer">
                        Recipient Pays
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>
                    Payment Status <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup 
                    value={paymentStatus} 
                    onValueChange={(value) => setPaymentStatus(value as 'unpaid' | 'pending' | 'paid')}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paid" id="paid" />
                      <Label htmlFor="paid" className="font-normal cursor-pointer">
                        Paid (Cash at station)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pending" id="pending" />
                      <Label htmlFor="pending" className="font-normal cursor-pointer">
                        Pending (Mobile Money pending)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unpaid" id="unpaid" />
                      <Label htmlFor="unpaid" className="font-normal cursor-pointer">
                        Unpaid
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground">
                    Select "Paid" if customer paid cash immediately at the station.
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
                    Creating Parcel...
                  </>
                ) : (
                  'Create Parcel'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}