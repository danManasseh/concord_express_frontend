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
  ArrowLeft,
  Search,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AdminHeader from '@/components/admin/AdminHeader'; // Import reusable header

// Mock data for payments (linked to mockAllParcels conceptually)
const mockPaymentRecords = [
  {
    id: 'PAY001',
    trackingId: 'TRK001001',
    amount: 15.00,
    paymentOption: 'receiver_pays',
    paymentStatus: 'Pending',
    station: 'Station B - Uptown', // Destination station for TRK001001
    date: '2024-01-20T10:05:00Z',
  },
  {
    id: 'PAY002',
    trackingId: 'TRK001002',
    amount: 25.50,
    paymentOption: 'sender_cash',
    paymentStatus: 'Paid',
    station: 'Station A - Downtown', // Origin station for TRK001002
    date: '2024-01-20T11:05:00Z',
  },
  {
    id: 'PAY003',
    trackingId: 'TRK001003',
    amount: 30.00,
    paymentOption: 'sender_mobile',
    paymentStatus: 'Pending',
    station: 'Station B - Uptown', // Origin station for TRK001003
    date: '2024-01-19T14:35:00Z',
  },
  {
    id: 'PAY004',
    trackingId: 'TRK001004',
    amount: 10.00,
    paymentOption: 'receiver_pays',
    paymentStatus: 'Paid',
    station: 'Station A - Downtown', // Destination station for TRK001004
    date: '2024-01-18T09:05:00Z',
  },
  {
    id: 'PAY005',
    trackingId: 'TRK001006',
    amount: 40.00,
    paymentOption: 'sender_mobile',
    paymentStatus: 'Pending',
    station: 'Station D - West Side', // Origin station for TRK001006
    date: '2024-01-19T11:05:00Z',
  },
];

export default function AdminPaymentRecordsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [adminData, setAdminData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [paymentRecords, setPaymentRecords] = useState<any[]>([]);

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    const parsedAdmin = JSON.parse(admin);
    setAdminData(parsedAdmin);

    // Filter payments based on the logged-in admin's station
    // A payment is relevant if the parcel's origin or destination is this station
    // For simplicity, we'll use the 'station' field in mockPaymentRecords
    const stationPayments = mockPaymentRecords.filter(
      (p) => p.station === parsedAdmin.stationName
    );
    setPaymentRecords(stationPayments);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin/login');
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

  const filteredRecords = paymentRecords.filter((record) => {
    const matchesSearch = record.trackingId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = paymentStatusFilter === 'all' || record.paymentStatus === paymentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const updatePaymentStatus = (id: string, newStatus: string) => {
    setPaymentRecords(prevRecords =>
      prevRecords.map(r =>
        r.id === id ? { ...r, paymentStatus: newStatus } : r
      )
    );
    // In a real app, this would trigger an API call to update the payment and potentially the parcel status
    console.log(`Payment ${id} status updated to ${newStatus}`);
    alert(`Payment ${id} marked as ${newStatus}.`);
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
              Payment Records
            </h1>
            <p className="text-muted-foreground">
              Manage payment transactions for {adminData.stationName}
            </p>
          </div>
          <Button
            onClick={() => alert('Log Offline Payment feature coming soon!')}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Offline Payment
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Station Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Tracking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Records List/Table */}
            {filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No payment records found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : isMobile ? (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Payment ID</p>
                        <p className="font-mono font-bold text-foreground">{record.id}</p>
                      </div>
                      <Badge variant="outline" className={getPaymentStatusColor(record.paymentStatus)}>
                        {record.paymentStatus}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tracking ID</p>
                      <p className="text-foreground">{record.trackingId}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-foreground">${record.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Option</p>
                        <p className="text-foreground capitalize">{record.paymentOption.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-foreground">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/admin/parcels/${record.trackingId}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Parcel
                      </Button>
                      {record.paymentStatus === 'Pending' && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => updatePaymentStatus(record.id, 'Paid')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as Paid
                        </Button>
                      )}
                      {record.paymentStatus === 'Paid' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={() => updatePaymentStatus(record.id, 'Refunded')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Refund
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
                      <TableHead className="font-semibold">Payment ID</TableHead>
                      <TableHead className="font-semibold">Tracking ID</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Option</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>{record.trackingId}</TableCell>
                        <TableCell>${record.amount.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{record.paymentOption.replace('_', ' ')}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getPaymentStatusColor(record.paymentStatus)}
                          >
                            {record.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => navigate(`/admin/parcels/${record.trackingId}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {record.paymentStatus === 'Pending' && (
                              <Button
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => updatePaymentStatus(record.id, 'Paid')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mark Paid
                              </Button>
                            )}
                            {record.paymentStatus === 'Paid' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-8 text-xs"
                                onClick={() => updatePaymentStatus(record.id, 'Refunded')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Refund
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
