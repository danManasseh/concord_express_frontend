import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminHeader from '@/components/admin/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Package,
  Bell,
  LogOut,
  Truck,
  Search,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data for parcels (same as in AdminParcelManagementPage for consistency)
// In a real app, this would be fetched from a global state or API
const mockAllParcels = [
  {
    trackingId: 'TRK001001',
    sender: { name: 'Alice Smith' },
    recipient: { name: 'Bob Johnson' },
    originStation: 'Station A - Downtown',
    destinationStation: 'Station B - Uptown',
    status: 'Payment Pending',
    paymentStatus: 'Pending',
    paymentOption: 'receiver_pays',
    package: { amount: 15.00 },
    truckIdentifier: null,
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    trackingId: 'TRK001002',
    sender: { name: 'Charlie Brown' },
    recipient: { name: 'Diana Prince' },
    originStation: 'Station A - Downtown',
    destinationStation: 'Station C - East Side',
    status: 'In Transit',
    paymentStatus: 'Paid',
    paymentOption: 'sender_cash',
    package: { amount: 25.50 },
    truckIdentifier: 'TRK-BATCH-001',
    createdAt: '2024-01-20T11:00:00Z',
  },
  {
    trackingId: 'TRK001003',
    sender: { name: 'Eve Adams' },
    recipient: { name: 'Frank White' },
    originStation: 'Station B - Uptown',
    destinationStation: 'Station A - Downtown',
    status: 'In Transit', // Changed to In Transit for testing bulk update
    paymentStatus: 'Paid',
    paymentOption: 'sender_mobile',
    package: { amount: 30.00 },
    truckIdentifier: 'TRK-BATCH-002',
    createdAt: '2024-01-19T14:30:00Z',
  },
  {
    trackingId: 'TRK001004',
    sender: { name: 'Grace Kelly' },
    recipient: { name: 'Henry Ford' },
    originStation: 'Station C - East Side',
    destinationStation: 'Station A - Downtown',
    status: 'In Transit', // Changed to In Transit for testing bulk update
    paymentStatus: 'Paid',
    paymentOption: 'receiver_pays',
    package: { amount: 10.00 },
    truckIdentifier: 'TRK-BATCH-002', // Same batch as TRK001003
    createdAt: '2024-01-18T09:00:00Z',
  },
  {
    trackingId: 'TRK001005',
    sender: { name: 'Ivy Green' },
    recipient: { name: 'Jack Black' },
    originStation: 'Station A - Downtown',
    destinationStation: 'Station D - West Side',
    status: 'Pending Pickup',
    paymentStatus: 'Paid',
    paymentOption: 'sender_cash',
    package: { amount: 20.00 },
    truckIdentifier: null,
    createdAt: '2024-01-20T15:00:00Z',
  },
  {
    trackingId: 'TRK001006',
    sender: { name: 'Karen Blue' },
    recipient: { name: 'Liam Red' },
    originStation: 'Station D - West Side',
    destinationStation: 'Station A - Downtown',
    status: 'Payment Pending',
    paymentStatus: 'Pending',
    paymentOption: 'sender_mobile',
    package: { amount: 40.00 },
    truckIdentifier: 'TRK-BATCH-004',
    createdAt: '2024-01-19T11:00:00Z',
  },
];

export default function AdminBusArrivalPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [adminData, setAdminData] = useState<any>(null);
  const [truckIdentifierInput, setTruckIdentifierInput] = useState('');
  const [matchingParcels, setMatchingParcels] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    setAdminData(JSON.parse(admin));
  }, [navigate]);

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

  const findParcelsByTruck = () => {
    setMessage(null);
    if (!truckIdentifierInput.trim()) {
      setMessage({ type: 'error', text: 'Please enter a Truck/Batch Identifier.' });
      setMatchingParcels([]);
      return;
    }

    const currentStationName = adminData?.stationName;
    const found = mockAllParcels.filter(
      (p) =>
        p.truckIdentifier?.toLowerCase() === truckIdentifierInput.trim().toLowerCase() &&
        p.destinationStation === currentStationName &&
        p.status === 'In Transit'
    );

    if (found.length === 0) {
      setMessage({ type: 'error', text: 'No "In Transit" parcels found for this batch at your station.' });
    } else {
      setMessage({ type: 'success', text: `${found.length} parcels found for this batch.` });
    }
    setMatchingParcels(found);
  };

  const handleBulkUpdate = () => {
    if (matchingParcels.length === 0) {
      setMessage({ type: 'error', text: 'No parcels to update.' });
      return;
    }

    // Simulate updating status for all matching parcels
    const updatedTrackingIds = matchingParcels.map(p => p.trackingId);
    console.log(`Bulk updating parcels ${updatedTrackingIds.join(', ')} to 'Arrived'.`);
    
    // In a real app, this would be an API call to update the database
    // For mock, we'll just update the local mockAllParcels (conceptually)
    // and then clear the list.
    
    setMessage({ type: 'success', text: `Successfully updated ${matchingParcels.length} parcels to 'Arrived'. Notifications sent.` });
    setMatchingParcels([]); // Clear the list after update
    setTruckIdentifierInput(''); // Clear input
    
    // Simulate sending notifications
    updatedTrackingIds.forEach(id => {
      console.log(`Notification sent for parcel ${id}: Status changed to Arrived.`);
    });
  };

  if (!adminData) return null;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminData={adminData} notificationCount={3} /> {/* Use reusable header */}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Bus Arrival / Bulk Update
          </h1>
          <p className="text-muted-foreground">
            Update multiple parcels to "Arrived" status upon truck arrival at {adminData.stationName}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Truck className="h-6 w-6" />
              Enter Truck/Batch Identifier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="e.g., TRK-BATCH-001"
                value={truckIdentifierInput}
                onChange={(e) => setTruckIdentifierInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && findParcelsByTruck()}
                className="flex-1 h-11"
              />
              <Button onClick={findParcelsByTruck} className="h-11 sm:w-auto">
                <Search className="h-4 w-4 mr-2" />
                Find Parcels
              </Button>
            </div>
            {message && (
              <div
                className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {matchingParcels.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground">
                Parcels in Batch "{truckIdentifierInput}"
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                These parcels are currently "In Transit" and destined for {adminData.stationName}.
              </p>
            </CardHeader>
            <CardContent>
              {isMobile ? (
                <div className="space-y-4">
                  {matchingParcels.map((parcel) => (
                    <div
                      key={parcel.trackingId}
                      className="border border-border rounded-lg p-4 space-y-3"
                    >
                      <div>
                        <p className="text-xs text-muted-foreground">Tracking ID</p>
                        <p className="font-mono font-bold text-foreground">{parcel.trackingId}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Sender</p>
                          <p className="text-foreground">{parcel.sender.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Recipient</p>
                          <p className="text-foreground">{parcel.recipient.name}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Origin</p>
                          <p className="text-foreground">{parcel.originStation}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Destination</p>
                          <p className="text-foreground">{parcel.destinationStation}</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="text-xs text-muted-foreground">Current Status</p>
                        <Badge variant="outline" className={getStatusColor(parcel.status)}>
                          {parcel.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="bg-muted/50">
                        <th className="h-10 px-2 text-left align-middle font-semibold text-muted-foreground">
                          Tracking ID
                        </th>
                        <th className="h-10 px-2 text-left align-middle font-semibold text-muted-foreground">
                          Sender
                        </th>
                        <th className="h-10 px-2 text-left align-middle font-semibold text-muted-foreground">
                          Recipient
                        </th>
                        <th className="h-10 px-2 text-left align-middle font-semibold text-muted-foreground">
                          Origin
                        </th>
                        <th className="h-10 px-2 text-left align-middle font-semibold text-muted-foreground">
                          Destination
                        </th>
                        <th className="h-10 px-2 text-left align-middle font-semibold text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {matchingParcels.map((parcel) => (
                        <tr key={parcel.trackingId} className="border-b hover:bg-muted/30">
                          <td className="p-2 align-middle font-medium">{parcel.trackingId}</td>
                          <td className="p-2 align-middle">{parcel.sender.name}</td>
                          <td className="p-2 align-middle">{parcel.recipient.name}</td>
                          <td className="p-2 align-middle">{parcel.originStation}</td>
                          <td className="p-2 align-middle">{parcel.destinationStation}</td>
                          <td className="p-2 align-middle">
                            <Badge variant="outline" className={getStatusColor(parcel.status)}>
                              {parcel.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <Button
                onClick={handleBulkUpdate}
                className="w-full mt-6 h-11 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Truck className="h-4 w-4 mr-2" />
                Mark All as Arrived
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
