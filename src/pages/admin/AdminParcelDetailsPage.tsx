import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader'; // Import reusable header

// Mock data for parcels (same as in AdminParcelManagementPage for consistency)
const mockAllParcels = [
  {
    trackingId: 'TRK001001',
    sender: { name: 'Alice Smith', phone: '111-222-3333', email: 'alice@example.com' },
    recipient: { name: 'Bob Johnson', phone: '444-555-6666', email: 'bob@example.com' },
    originStation: 'Station A - Downtown',
    destinationStation: 'Station B - Uptown',
    status: 'Payment Pending',
    paymentStatus: 'Pending',
    paymentOption: 'receiver_pays',
    package: {
      description: 'Small electronics',
      weight: '0.5 kg',
      amount: 15.00,
      deliveryType: 'standard',
      photo: '',
    },
    truckIdentifier: null,
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    trackingId: 'TRK001002',
    sender: { name: 'Charlie Brown', phone: '777-888-9999', email: 'charlie@example.com' },
    recipient: { name: 'Diana Prince', phone: '123-456-7890', email: 'diana@example.com' },
    originStation: 'Station A - Downtown',
    destinationStation: 'Station C - East Side',
    status: 'In Transit',
    paymentStatus: 'Paid',
    paymentOption: 'sender_cash',
    package: {
      description: 'Documents',
      weight: '0.2 kg',
      amount: 25.50,
      deliveryType: 'express',
      photo: '',
    },
    truckIdentifier: 'TRK-BATCH-001',
    createdAt: '2024-01-20T11:00:00Z',
  },
  {
    trackingId: 'TRK001003',
    sender: { name: 'Eve Adams', phone: '987-654-3210', email: 'eve@example.com' },
    recipient: { name: 'Frank White', phone: '012-345-6789', email: 'frank@example.com' },
    originStation: 'Station B - Uptown',
    destinationStation: 'Station A - Downtown',
    status: 'Arrived',
    paymentStatus: 'Paid',
    paymentOption: 'sender_mobile',
    package: {
      description: 'Clothing',
      weight: '1.2 kg',
      amount: 30.00,
      deliveryType: 'standard',
      photo: '',
    },
    truckIdentifier: 'TRK-BATCH-002',
    createdAt: '2024-01-19T14:30:00Z',
  },
  {
    trackingId: 'TRK001004',
    sender: { name: 'Grace Kelly', phone: '555-111-2222', email: 'grace@example.com' },
    recipient: { name: 'Henry Ford', phone: '333-444-5555', email: 'henry@example.com' },
    originStation: 'Station C - East Side',
    destinationStation: 'Station A - Downtown',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentOption: 'receiver_pays',
    package: {
      description: 'Books',
      weight: '2.0 kg',
      amount: 10.00,
      deliveryType: 'standard',
      photo: '',
    },
    truckIdentifier: 'TRK-BATCH-003',
    createdAt: '2024-01-18T09:00:00Z',
  },
  {
    trackingId: 'TRK001005',
    sender: { name: 'Ivy Green', phone: '666-777-8888', email: 'ivy@example.com' },
    recipient: { name: 'Jack Black', phone: '999-000-1111', email: 'jack@example.com' },
    originStation: 'Station A - Downtown',
    destinationStation: 'Station D - West Side',
    status: 'Pending Pickup',
    paymentStatus: 'Paid',
    paymentOption: 'sender_cash',
    package: {
      description: 'Artwork',
      weight: '1.0 kg',
      amount: 20.00,
      deliveryType: 'express',
      photo: '',
    },
    truckIdentifier: null,
    createdAt: '2024-01-20T15:00:00Z',
  },
  {
    trackingId: 'TRK001006',
    sender: { name: 'Karen Blue', phone: '222-333-4444', email: 'karen@example.com' },
    recipient: { name: 'Liam Red', phone: '555-666-7777', email: 'liam@example.com' },
    originStation: 'Station D - West Side',
    destinationStation: 'Station A - Downtown',
    status: 'Payment Pending',
    paymentStatus: 'Pending',
    paymentOption: 'sender_mobile',
    package: {
      description: 'Sporting goods',
      weight: '5.0 kg',
      amount: 40.00,
      deliveryType: 'standard',
      photo: '',
    },
    truckIdentifier: 'TRK-BATCH-004',
    createdAt: '2024-01-19T11:00:00Z',
  },
];

const allStations = [
  { id: 'station-a', name: 'Station A - Downtown' },
  { id: 'station-b', name: 'Station B - Uptown' },
  { id: 'station-c', name: 'Station C - East Side' },
  { id: 'station-d', name: 'Station D - West Side' },
  { id: 'station-e', name: 'Station E - North End' },
  { id: 'station-f', name: 'Station F - South District' },
];

const parcelStatuses = [
  'Payment Pending',
  'Pending Pickup',
  'Picked Up',
  'In Transit',
  'Arrived',
  'Delivered',
  'Failed',
];

const paymentStatuses = ['Pending', 'Paid', 'Refunded'];

export default function AdminParcelDetailsPage() {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<any>(null);
  const [parcel, setParcel] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Editable states
  const [currentStatus, setCurrentStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [truckIdentifier, setTruckIdentifier] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    setAdminData(JSON.parse(admin));

    const foundParcel = mockAllParcels.find((p) => p.trackingId === trackingId);
    if (foundParcel) {
      setParcel(foundParcel);
      setCurrentStatus(foundParcel.status);
      setPaymentStatus(foundParcel.paymentStatus);
      setTruckIdentifier(foundParcel.truckIdentifier || '');
      setDescription(foundParcel.package.description);
      setWeight(foundParcel.package.weight);
      setAmount(foundParcel.package.amount.toFixed(2));
    } else {
      alert('Parcel not found!');
      navigate('/admin/parcels');
    }
  }, [trackingId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payment Pending':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Pending Pickup':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Picked Up':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'In Transit':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Arrived':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Failed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Refunded':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call to update the parcel
    const updatedParcel = {
      ...parcel,
      status: currentStatus,
      paymentStatus: paymentStatus,
      truckIdentifier: truckIdentifier || null,
      package: {
        ...parcel.package,
        description: description,
        weight: weight,
        amount: parseFloat(amount),
      },
    };
    console.log('Saving changes:', updatedParcel);
    alert('Parcel updated successfully!');
    setIsEditing(false);
    setParcel(updatedParcel); // Update local state to reflect changes
  };

  if (!adminData || !parcel) return null;

  const isOriginStationAdmin = adminData.stationName === parcel.originStation;
  const isDestinationStationAdmin = adminData.stationName === parcel.destinationStation;

  const canEditStatus = (status: string) => {
    if (parcel.paymentStatus !== 'Paid' && status !== 'Payment Pending') {
      return false; // Cannot change status if payment is not paid, unless it's Payment Pending
    }
    switch (status) {
      case 'Payment Pending':
        return true; // Can always set to payment pending
      case 'Pending Pickup':
        return isOriginStationAdmin;
      case 'Picked Up':
        return isOriginStationAdmin;
      case 'In Transit':
        return isOriginStationAdmin || isDestinationStationAdmin; // Both can see, origin can set
      case 'Arrived':
        return isDestinationStationAdmin;
      case 'Delivered':
        return isDestinationStationAdmin;
      case 'Failed':
        return true; // Any admin can mark as failed
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminData={adminData} notificationCount={3} /> {/* Use reusable header */}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/parcels')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Parcel Management
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Parcel Details: {parcel.trackingId}
            </h1>
            <p className="text-muted-foreground">
              View and update details for this parcel
            </p>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} className="w-full sm:w-auto">
            {isEditing ? 'Cancel Edit' : 'Edit Parcel'}
          </Button>
        </div>

        <form onSubmit={handleSaveChanges} className="space-y-6">
          {/* Parcel Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl">Summary</CardTitle>
                <Badge variant="outline" className={getStatusColor(parcel.status)}>
                  {parcel.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tracking ID</Label>
                  <Input value={parcel.trackingId} readOnly className="h-11 bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Created At</Label>
                  <Input
                    value={new Date(parcel.createdAt).toLocaleString()}
                    readOnly
                    className="h-11 bg-muted"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sender Name</Label>
                  <Input value={parcel.sender.name} readOnly className="h-11 bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Recipient Name</Label>
                  <Input value={parcel.recipient.name} readOnly className="h-11 bg-muted" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Origin Station</Label>
                  <Input value={parcel.originStation} readOnly className="h-11 bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Destination Station</Label>
                  <Input value={parcel.destinationStation} readOnly className="h-11 bg-muted" />
                </div>
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  readOnly={!isEditing}
                  className={`min-h-[100px] ${!isEditing ? 'bg-muted cursor-not-allowed' : ''}`}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    readOnly={!isEditing}
                    className={`h-11 ${!isEditing ? 'bg-muted cursor-not-allowed' : ''}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    readOnly={!isEditing}
                    className={`h-11 ${!isEditing ? 'bg-muted cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Delivery Type</Label>
                <Input
                  value={parcel.package.deliveryType}
                  readOnly
                  className="h-11 bg-muted cursor-not-allowed"
                />
              </div>
              {parcel.package.photo && (
                <div className="space-y-2">
                  <Label>Package Photo</Label>
                  <img
                    src={parcel.package.photo}
                    alt="Package"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status & Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Status & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentStatus">Current Status</Label>
                <Select
                  value={currentStatus}
                  onValueChange={setCurrentStatus}
                  disabled={!isEditing}
                  required
                >
                  <SelectTrigger
                    className={`h-11 ${!isEditing ? 'bg-muted cursor-not-allowed' : ''}`}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {parcelStatuses.map((status) => (
                      <SelectItem key={status} value={status} disabled={!canEditStatus(status)}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Only relevant station admins can update certain statuses.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select
                  value={paymentStatus}
                  onValueChange={setPaymentStatus}
                  disabled={!isEditing}
                  required
                >
                  <SelectTrigger
                    className={`h-11 ${!isEditing ? 'bg-muted cursor-not-allowed' : ''}`}
                  >
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Current payment option: {parcel.paymentOption.replace('_', ' ')}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="truckIdentifier">Truck/Batch Identifier</Label>
                <Input
                  id="truckIdentifier"
                  type="text"
                  value={truckIdentifier}
                  onChange={(e) => setTruckIdentifier(e.target.value)}
                  readOnly={!isEditing}
                  className={`h-11 ${!isEditing ? 'bg-muted cursor-not-allowed' : ''}`}
                />
              </div>
            </CardContent>
          </Card>

          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="h-11 flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
