import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Package,
  Search,
  Bell,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Truck,
  Clock,
  MessageSquare,
} from 'lucide-react';
import MobileNav from '@/components/MobileNav';
import DriverParcelCard from '@/components/DriverParcelCard';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data for assigned parcels
const mockAssignedParcels = [
  {
    id: 'TRK001234',
    recipient: {
      name: 'Jane Smith',
      phone: '+1 (555) 123-4567',
      email: 'jane.smith@email.com',
    },
    origin: 'Station A - Downtown',
    destination: 'Station B - Uptown',
    status: 'Picked Up',
    pickupDate: '2024-01-15 09:30 AM',
    notes: '',
  },
  {
    id: 'TRK001237',
    recipient: {
      name: 'Frank Blue',
      phone: '+1 (555) 234-5678',
      email: 'frank.blue@email.com',
    },
    origin: 'Station C - East Side',
    destination: 'Station A - Downtown',
    status: 'In Transit',
    pickupDate: '2024-01-15 08:00 AM',
    notes: 'Fragile items - handle with care',
  },
  {
    id: 'TRK001240',
    recipient: {
      name: 'Sarah Green',
      phone: '+1 (555) 345-6789',
      email: 'sarah.green@email.com',
    },
    origin: 'Station A - Downtown',
    destination: 'Station D - West Side',
    status: 'Picked Up',
    pickupDate: '2024-01-15 10:15 AM',
    notes: '',
  },
  {
    id: 'TRK001241',
    recipient: {
      name: 'Michael Brown',
      phone: '+1 (555) 456-7890',
      email: 'michael.brown@email.com',
    },
    origin: 'Station B - Uptown',
    destination: 'Station C - East Side',
    status: 'Arrived',
    pickupDate: '2024-01-15 07:45 AM',
    notes: '',
  },
];

export default function DriverPortalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [parcels, setParcels] = useState(mockAssignedParcels);
  const [selectedParcel, setSelectedParcel] = useState<typeof mockAssignedParcels[0] | null>(null);
  const [driverNotes, setDriverNotes] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Picked Up':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'In Transit':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Arrived':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Picked Up':
        return <Package className="h-4 w-4" />;
      case 'In Transit':
        return <Truck className="h-4 w-4" />;
      case 'Arrived':
        return <MapPin className="h-4 w-4" />;
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const updateParcelStatus = (trackingId: string, newStatus: string) => {
    setParcels(
      parcels.map((parcel) =>
        parcel.id === trackingId ? { ...parcel, status: newStatus } : parcel
      )
    );
    console.log(`Updated ${trackingId} to ${newStatus}`);
  };

  const handleAddNotes = () => {
    if (selectedParcel && driverNotes.trim()) {
      setParcels(
        parcels.map((parcel) =>
          parcel.id === selectedParcel.id
            ? { ...parcel, notes: driverNotes }
            : parcel
        )
      );
      console.log(`Added notes to ${selectedParcel.id}: ${driverNotes}`);
      setDriverNotes('');
      setIsDialogOpen(false);
      setSelectedParcel(null);
    }
  };

  const openNotesDialog = (parcel: typeof mockAssignedParcels[0]) => {
    setSelectedParcel(parcel);
    setDriverNotes(parcel.notes);
    setIsDialogOpen(true);
  };

  const filteredParcels = parcels.filter(
    (parcel) =>
      parcel.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = ['Picked Up', 'In Transit', 'Arrived', 'Delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
  };

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
                  to="/driver-portal"
                  className="text-primary font-medium border-b-2 border-primary pb-1"
                >
                  My Deliveries
                </Link>
                <Link
                  to="/driver-history"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  History
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
                  <p className="text-sm font-medium text-foreground">Mike Johnson</p>
                  <p className="text-xs text-muted-foreground">Driver</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  MJ
                </div>
              </div>
              <MobileNav
                links={[
                  { to: '/driver-portal', label: 'My Deliveries', active: true },
                  { to: '/driver-history', label: 'History' },
                ]}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Deliveries
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {parcels.filter((p) => p.status !== 'Delivered').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Transit
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {parcels.filter((p) => p.status === 'In Transit').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Arrived
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {parcels.filter((p) => p.status === 'Arrived').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Today
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {parcels.filter((p) => p.status === 'Delivered').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Parcels Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground">
                Assigned Parcels
              </CardTitle>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tracking ID, recipient, or destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isMobile ? (
              <div className="space-y-3">
                {filteredParcels.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No parcels found</p>
                ) : (
                  filteredParcels.map((parcel) => (
                    <DriverParcelCard
                      key={parcel.id}
                      parcel={parcel}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                      getNextStatus={getNextStatus}
                      onUpdateStatus={updateParcelStatus}
                      onOpenNotes={openNotesDialog}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Tracking ID</TableHead>
                    <TableHead className="font-semibold">Recipient</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Origin</TableHead>
                    <TableHead className="font-semibold">Destination</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Pickup Time</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParcels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No parcels found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredParcels.map((parcel) => (
                      <TableRow key={parcel.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{parcel.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{parcel.recipient.name}</p>
                            {parcel.notes && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                Has notes
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <a
                              href={`tel:${parcel.recipient.phone}`}
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <Phone className="h-3 w-3" />
                              {parcel.recipient.phone}
                            </a>
                            <a
                              href={`mailto:${parcel.recipient.email}`}
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <Mail className="h-3 w-3" />
                              {parcel.recipient.email}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{parcel.origin}</TableCell>
                        <TableCell className="text-sm">{parcel.destination}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(parcel.status)} flex items-center gap-1 w-fit`}
                          >
                            {getStatusIcon(parcel.status)}
                            {parcel.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{parcel.pickupDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {parcel.status !== 'Delivered' && getNextStatus(parcel.status) && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateParcelStatus(parcel.id, getNextStatus(parcel.status)!)
                                }
                                className="h-8 text-xs"
                              >
                                Mark as {getNextStatus(parcel.status)}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openNotesDialog(parcel)}
                              className="h-8 text-xs"
                            >
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Notes
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add/Edit Notes</DialogTitle>
            <DialogDescription>
              Add notes for parcel {selectedParcel?.id} - {selectedParcel?.recipient.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Driver Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about delays, special instructions, or any issues..."
                value={driverNotes}
                onChange={(e) => setDriverNotes(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                These notes will be visible to the admin and can help explain any delays or issues.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setDriverNotes('');
                setSelectedParcel(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
