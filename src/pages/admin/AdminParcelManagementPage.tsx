import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  Search,
  ArrowLeft,
  Eye,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  UserPlus,
  Plus,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AdminHeader from '@/components/admin/AdminHeader'; // Import reusable header

// Mock data for parcels (will be filtered by station)
const mockAllParcels = [
  {
    trackingId: 'TRK001001',
    sender: { name: 'Alice Smith' },
    recipient: { name: 'Bob Johnson' },
    originStation: 'Station A - Downtown',
    destinationStation: 'Station B - Uptown',
    status: 'Payment Pending', // Updated status
    paymentStatus: 'Pending',
    paymentOption: 'receiver_pays',
    package: { amount: 15.00 }, // Ensure package object exists
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
    package: { amount: 25.50 }, // Ensure package object exists
    truckIdentifier: 'TRK-BATCH-001',
    createdAt: '2024-01-20T11:00:00Z',
  },
  {
    trackingId: 'TRK001003',
    sender: { name: 'Eve Adams' },
    recipient: { name: 'Frank White' },
    originStation: 'Station B - Uptown',
    destinationStation: 'Station A - Downtown',
    status: 'Arrived',
    paymentStatus: 'Paid',
    paymentOption: 'sender_mobile',
    package: { amount: 30.00 }, // Ensure package object exists
    truckIdentifier: 'TRK-BATCH-002',
    createdAt: '2024-01-19T14:30:00Z',
  },
  {
    trackingId: 'TRK001004',
    sender: { name: 'Grace Kelly' },
    recipient: { name: 'Henry Ford' },
    originStation: 'Station C - East Side',
    destinationStation: 'Station A - Downtown',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentOption: 'receiver_pays',
    package: { amount: 10.00 }, // Ensure package object exists
    truckIdentifier: 'TRK-BATCH-003',
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
    package: { amount: 20.00 }, // Ensure package object exists
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
    package: { amount: 40.00 }, // Ensure package object exists
    truckIdentifier: 'TRK-BATCH-004',
    createdAt: '2024-01-19T11:00:00Z',
  },
];

export default function AdminParcelManagementPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [adminData, setAdminData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [parcels, setParcels] = useState<any[]>([]);

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    const parsedAdmin = JSON.parse(admin);
    setAdminData(parsedAdmin);

    // Filter parcels based on the logged-in admin's station
    const stationParcels = mockAllParcels.filter(
      (p) =>
        p.originStation === parsedAdmin.stationName ||
        p.destinationStation === parsedAdmin.stationName
    );
    setParcels(stationParcels);
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
        return 'bg-gray-100 text-gray-800 border-gray-300'; // Or a specific failed color
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

  const filteredParcels = parcels.filter((parcel) => {
    const matchesSearch =
      parcel.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.recipient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || parcel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateParcelStatus = (trackingId: string, newStatus: string) => {
    setParcels(prevParcels =>
      prevParcels.map(p =>
        p.trackingId === trackingId ? { ...p, status: newStatus } : p
      )
    );
    // In a real app, this would trigger an API call
    console.log(`Parcel ${trackingId} status updated to ${newStatus}`);
  };

  const getNextStatusAction = (parcel: any) => {
    const currentStation = adminData?.stationName;
    const isOriginStation = parcel.originStation === currentStation;
    const isDestinationStation = parcel.destinationStation === currentStation;

    // Only allow status updates if payment is 'Paid'
    if (parcel.paymentStatus !== 'Paid') {
      return null;
    }

    switch (parcel.status) {
      case 'Payment Pending':
        // This status should be updated via payment records, not here
        return null;
      case 'Pending Pickup':
        if (isOriginStation) return { label: 'Mark as Picked Up', newStatus: 'Picked Up' };
        break;
      case 'Picked Up':
        if (isOriginStation) return { label: 'Mark as In Transit', newStatus: 'In Transit' };
        break;
      case 'In Transit':
        if (isDestinationStation) return { label: 'Mark as Arrived', newStatus: 'Arrived' };
        break;
      case 'Arrived':
        if (isDestinationStation) return { label: 'Mark as Delivered', newStatus: 'Delivered' };
        break;
      default:
        return null;
    }
    return null;
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

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Parcel Management
            </h1>
            <p className="text-muted-foreground">
              View and manage all parcels for {adminData.stationName}
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin/create-parcel')}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Parcel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Station Parcels
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tracking ID, sender, or recipient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Payment Pending">Payment Pending</SelectItem>
                  <SelectItem value="Pending Pickup">Pending Pickup</SelectItem>
                  <SelectItem value="Picked Up">Picked Up</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Arrived">Arrived</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Parcels List/Table */}
            {filteredParcels.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No parcels found for {adminData.stationName}
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters, or create a new parcel.
                </p>
              </div>
            ) : isMobile ? (
              <div className="space-y-4">
                {filteredParcels.map((parcel) => (
                  <div
                    key={parcel.trackingId}
                    className="border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Tracking ID</p>
                        <p className="font-mono font-bold text-foreground">{parcel.trackingId}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(parcel.status)}>
                        {parcel.status}
                      </Badge>
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
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-foreground">
                          {parcel.package?.amount !== undefined
                            ? `$${parcel.package.amount.toFixed(2)}`
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Payment</p>
                        <Badge variant="outline" className={`${getPaymentStatusColor(parcel.paymentStatus)} text-xs`}>
                          {parcel.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/admin/parcels/${parcel.trackingId}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {getNextStatusAction(parcel) && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            updateParcelStatus(
                              parcel.trackingId,
                              getNextStatusAction(parcel)!.newStatus
                            )
                          }
                        >
                          {getNextStatusAction(parcel)!.label}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Tracking ID</TableHead>
                      <TableHead className="font-semibold">Sender</TableHead>
                      <TableHead className="font-semibold">Recipient</TableHead>
                      <TableHead className="font-semibold">Origin</TableHead>
                      <TableHead className="font-semibold">Destination</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Payment</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParcels.map((parcel) => (
                      <TableRow key={parcel.trackingId} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{parcel.trackingId}</TableCell>
                        <TableCell>{parcel.sender.name}</TableCell>
                        <TableCell>{parcel.recipient.name}</TableCell>
                        <TableCell>{parcel.originStation}</TableCell>
                        <TableCell>{parcel.destinationStation}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColor(parcel.status)}
                          >
                            {parcel.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {parcel.package?.amount !== undefined
                            ? `$${parcel.package.amount.toFixed(2)}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getPaymentStatusColor(parcel.paymentStatus)}
                          >
                            {parcel.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => navigate(`/admin/parcels/${parcel.trackingId}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {getNextStatusAction(parcel) && (
                              <Button
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() =>
                                  updateParcelStatus(
                                    parcel.trackingId,
                                    getNextStatusAction(parcel)!.newStatus
                                  )
                                }
                              >
                                {getNextStatusAction(parcel)!.label}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
