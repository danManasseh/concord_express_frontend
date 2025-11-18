import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  DollarSign,
  Search,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import SuperAdminHeader from '@/components/superadmin/SuperAdminHeader';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data for all payments (global view)
const mockAllPaymentRecords = [
  {
    id: 'PAY001',
    trackingId: 'TRK001001',
    amount: 15.00,
    paymentOption: 'receiver_pays',
    paymentStatus: 'Pending',
    station: 'Station B - Uptown',
    date: '2024-01-20T10:05:00Z',
  },
  {
    id: 'PAY002',
    trackingId: 'TRK001002',
    amount: 25.50,
    paymentOption: 'sender_cash',
    paymentStatus: 'Paid',
    station: 'Station A - Downtown',
    date: '2024-01-20T11:05:00Z',
  },
  {
    id: 'PAY003',
    trackingId: 'TRK001003',
    amount: 30.00,
    paymentOption: 'sender_mobile',
    paymentStatus: 'Pending',
    station: 'Station B - Uptown',
    date: '2024-01-19T14:35:00Z',
  },
  {
    id: 'PAY004',
    trackingId: 'TRK001004',
    amount: 10.00,
    paymentOption: 'receiver_pays',
    paymentStatus: 'Paid',
    station: 'Station C - East Side', // Changed station for global view diversity
    date: '2024-01-18T09:05:00Z',
  },
  {
    id: 'PAY005',
    trackingId: 'TRK001005',
    amount: 20.00,
    paymentOption: 'sender_cash',
    paymentStatus: 'Paid',
    station: 'Station A - Downtown',
    date: '2024-01-20T15:05:00Z',
  },
  {
    id: 'PAY006',
    trackingId: 'TRK001006',
    amount: 40.00,
    paymentOption: 'sender_mobile',
    paymentStatus: 'Pending',
    station: 'Station D - West Side',
    date: '2024-01-19T11:05:00Z',
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

export default function SuperAdminGlobalPaymentRecordsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [superAdminData, setSuperAdminData] = useState<any>(null);
  const [paymentRecords, setPaymentRecords] = useState(mockAllPaymentRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stationFilter, setStationFilter] = useState('all');

  useEffect(() => {
    const superadmin = localStorage.getItem('superadmin');
    if (!superadmin) {
      navigate('/superadmin/login');
      return;
    }
    setSuperAdminData(JSON.parse(superadmin));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('superadmin');
    navigate('/superadmin/login');
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
    const matchesStatus = statusFilter === 'all' || record.paymentStatus === statusFilter;
    const matchesStation = stationFilter === 'all' || record.station === stationFilter;
    return matchesSearch && matchesStatus && matchesStation;
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

  if (!superAdminData) return null;

  return (
    <div className="min-h-screen bg-background">
      <SuperAdminHeader superAdminData={superAdminData} notificationCount={5} />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/superadmin/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Global Payment Records
          </h1>
          <p className="text-muted-foreground">
            View and manage all payment transactions across all stations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              All Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Tracking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={stationFilter} onValueChange={setStationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by station" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stations</SelectItem>
                    {allStations.map((station) => (
                      <SelectItem key={station.id} value={station.name}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                        <p className="text-xs text-muted-foreground">Station</p>
                        <p className="text-foreground">{record.station}</p>
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
                      <TableHead className="font-semibold">Station</TableHead>
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
                        <TableCell>{record.station}</TableCell>
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
