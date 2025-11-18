import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  TrendingUp,
  DollarSign,
  CheckCircle,
  Search,
  Bell,
  Eye,
  UserPlus,
} from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import ParcelCard from '@/components/ParcelCard';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data
const mockParcels = [
  {
    id: 'TRK001234',
    sender: 'John Doe',
    recipient: 'Jane Smith',
    status: 'In Transit',
    driver: 'Mike Johnson',
    paymentStatus: 'Paid',
    date: '2024-01-15',
    destination: 'Station A',
  },
  {
    id: 'TRK001235',
    sender: 'Alice Brown',
    recipient: 'Bob Wilson',
    status: 'Delivered',
    driver: 'Sarah Davis',
    paymentStatus: 'Paid',
    date: '2024-01-14',
    destination: 'Station B',
  },
  {
    id: 'TRK001236',
    sender: 'Charlie Green',
    recipient: 'Diana White',
    status: 'Created',
    driver: 'Unassigned',
    paymentStatus: 'Pending',
    date: '2024-01-15',
    destination: 'Station C',
  },
  {
    id: 'TRK001237',
    sender: 'Eve Black',
    recipient: 'Frank Blue',
    status: 'Arrived',
    driver: 'Tom Anderson',
    paymentStatus: 'Paid',
    date: '2024-01-15',
    destination: 'Station A',
  },
  {
    id: 'TRK001238',
    sender: 'Grace Red',
    recipient: 'Henry Yellow',
    status: 'Failed',
    driver: 'Lisa Martinez',
    paymentStatus: 'Refunded',
    date: '2024-01-13',
    destination: 'Station D',
  },
];

const mockNotifications = [
  { id: 1, message: 'New parcel TRK001239 created', time: '5 min ago' },
  { id: 2, message: 'Driver Mike Johnson completed delivery', time: '15 min ago' },
  { id: 3, message: 'Payment received for TRK001234', time: '1 hour ago' },
  { id: 4, message: 'Parcel TRK001240 marked as failed', time: '2 hours ago' },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const isMobile = useIsMobile();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Created':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Arrived':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Failed':
        return 'bg-red-100 text-red-800 border-red-300';
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

  const filteredParcels = mockParcels.filter((parcel) => {
    const matchesSearch =
      parcel.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || parcel.status === statusFilter;
    const matchesDestination =
      destinationFilter === 'all' || parcel.destination === destinationFilter;
    return matchesSearch && matchesStatus && matchesDestination;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-8">
              <Link to="/">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">VIP Express</h1>
              </Link>
              <nav className="hidden lg:flex items-center gap-6">
                <Link
                  to="/dashboard"
                  className="text-primary font-medium border-b-2 border-primary pb-1"
                >
                  Dashboard
                </Link>
                <Link
                  to="/parcels"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Parcels
                </Link>
                <Link
                  to="/drivers"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Drivers
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">Station Manager</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  A
                </div>
              </div>
              <MobileNav
                links={[
                  { to: '/dashboard', label: 'Dashboard', active: true },
                  { to: '/parcels', label: 'Parcels' },
                  { to: '/drivers', label: 'Drivers' },
                ]}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Analytics Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Parcels Today
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">127</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+12%</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Delivery Success Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">94.5%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+2.1%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Payment Summary
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$12,450</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+8%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Deliveries
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1,234</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parcel Overview Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Parcel Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Created">Created</SelectItem>
                        <SelectItem value="In Transit">In Transit</SelectItem>
                        <SelectItem value="Arrived">Arrived</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Station" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Stations</SelectItem>
                        <SelectItem value="Station A">Station A</SelectItem>
                        <SelectItem value="Station B">Station B</SelectItem>
                        <SelectItem value="Station C">Station C</SelectItem>
                        <SelectItem value="Station D">Station D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Table for Desktop, Cards for Mobile */}
                {isMobile ? (
                  <div className="space-y-3">
                    {filteredParcels.map((parcel) => (
                      <ParcelCard
                        key={parcel.id}
                        parcel={parcel}
                        getStatusColor={getStatusColor}
                        getPaymentStatusColor={getPaymentStatusColor}
                      />
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
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Driver</TableHead>
                        <TableHead className="font-semibold">Payment</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredParcels.map((parcel) => (
                        <TableRow key={parcel.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{parcel.id}</TableCell>
                          <TableCell>{parcel.sender}</TableCell>
                          <TableCell>{parcel.recipient}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusColor(parcel.status)}
                            >
                              {parcel.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {parcel.driver === 'Unassigned' ? (
                              <span className="text-muted-foreground italic">
                                {parcel.driver}
                              </span>
                            ) : (
                              parcel.driver
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getPaymentStatusColor(parcel.paymentStatus)}
                            >
                              {parcel.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>{parcel.date}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {parcel.driver === 'Unassigned' && (
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <UserPlus className="h-4 w-4" />
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

          {/* Notifications Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <p className="text-sm text-foreground mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
